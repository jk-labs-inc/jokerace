import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import isUrlToImage from "@helpers/isUrlToImage";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser from "@hooks/useUser";
import { chain, fetchEnsName, getAccount, readContract, watchContractEvent } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useProvider } from "wagmi";
import { useContestStore } from "../useContest/store";

export function useContestEvents() {
  const { asPath } = useRouter();
  const provider = useProvider();
  const { contestStatus } = useContestStore(state => state);
  const { setProposalData, setProposalVotes, listProposalsData, canUpdateVotesInRealTime } = useProposalStore(
    state => state,
  );

  const { updateCurrentUserVotes } = useUser();
  const [displayReloadBanner, setDisplayReloadBanner] = useState(false);
  const contestStatusRef = useRef(contestStatus);

  /**
   * Callback function triggered on "VoteCast" event
   * @param args - Array of the following values: from, to, value, event|event[]
   */
  async function onVoteCast(args: Array<any>) {
    try {
      const accountData = await getAccount();
      // if the connected wallet is the address that casted votes
      if (accountData?.address && args[0] === accountData?.address) {
        // Update the current user available votes
        updateCurrentUserVotes();
      }

      const proposalId = args[5].args.proposalId;
      const votes = await readContract({
        addressOrName: asPath.split("/")[3],
        contractInterface: DeployedContestContract.abi,
        functionName: "proposalVotes",
        args: proposalId,
      });

      if (listProposalsData[proposalId]) {
        //@ts-ignore
        setProposalVotes({
          id: proposalId,
          //@ts-ignore
          votes: votes?.forVotes ? votes?.forVotes / 1e18 - votes?.againstVotes / 1e18 : votes / 1e18,
        });
      } else {
        const proposal = await readContract({
          addressOrName: asPath.split("/")[3],
          contractInterface: DeployedContestContract.abi,
          functionName: "getProposal",
          args: proposalId,
        });

        let author;
        try {
          author = await fetchEnsName({
            address: proposal[0],
            chainId: chain.mainnet.id,
          });
        } catch (error: any) {
          author = proposal[0];
        }

        const proposalData: any = {
          authorEthereumAddress: proposal[0],
          author: author ?? proposal[0],
          content: proposal[1],
          isContentImage: isUrlToImage(proposal[1]) ? true : false,
          exists: proposal[2],
          //@ts-ignore
          votes: votes?.forVotes ? votes?.forVotes / 1e18 - votes?.againstVotes / 1e18 : votes / 1e18,
        };

        setProposalData({ id: proposalId, data: proposalData });
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    contestStatusRef.current = contestStatus;
    if (canUpdateVotesInRealTime === false || contestStatus === CONTEST_STATUS.COMPLETED) {
      provider.removeAllListeners();
      setDisplayReloadBanner(false);
    } else {
      // Only watch VoteCast events when voting is open and we are <=1h before end of voting
      if (contestStatus === CONTEST_STATUS.VOTING_OPEN && canUpdateVotesInRealTime === true) {
        watchContractEvent(
          {
            addressOrName: asPath.split("/")[3],
            contractInterface: DeployedContestContract.abi,
          },
          "VoteCast",
          (...args) => {
            onVoteCast(args);
          },
        );
      }
    }
  }, [canUpdateVotesInRealTime, contestStatus]);

  function onVisibilityChangeHandler() {
    if (document.visibilityState === "hidden") {
      provider.removeAllListeners();
      if (contestStatusRef.current === CONTEST_STATUS.VOTING_OPEN) setDisplayReloadBanner(true);
    } else {
      if (contestStatusRef.current === CONTEST_STATUS.VOTING_OPEN && canUpdateVotesInRealTime === true) {
        provider.addListener("VoteCast", (...args) => {
          onVoteCast(args);
        });
      }
    }
  }
  useEffect(() => {
    watchContractEvent(
      {
        addressOrName: asPath.split("/")[3],
        contractInterface: DeployedContestContract.abi,
      },
      "VoteCast",
      (...args) => {
        onVoteCast(args);
      },
    );

    document.addEventListener("visibilitychange", onVisibilityChangeHandler);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChangeHandler);
    };
  }, []);

  return {
    displayReloadBanner,
  };
}

export default useContestEvents;
