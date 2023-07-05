import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import isUrlToImage from "@helpers/isUrlToImage";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser from "@hooks/useUser";
import { chain, fetchEnsName, getAccount, readContract, watchContractEvent } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProvider } from "wagmi";

export function useContestEvents() {
  const { asPath } = useRouter();
  const provider = useProvider();
  const { contestStatus } = useContestStatusStore(state => state);
  const { setProposalData, setProposalVotes, listProposalsData, canUpdateVotesInRealTime } = useProposalStore(
    state => state,
  );
  const { updateCurrentUserVotes } = useUser();
  const [displayReloadBanner, setDisplayReloadBanner] = useState(false);

  /**
   * Callback function triggered on "VoteCast" event
   * @param args - Array of the following values: from, to, value, event|event[]
   */
  async function onVoteCast(args: Array<any>) {
    try {
      const accountData = getAccount();
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
      }
      // Figure out why this else is needed
      // else {
      //   const proposal = await readContract({
      //     addressOrName: asPath.split("/")[3],
      //     contractInterface: DeployedContestContract.abi,
      //     functionName: "getProposal",
      //     args: proposalId,
      //   });

      //   let author;
      //   try {
      //     author = await fetchEnsName({
      //       address: proposal[0],
      //       chainId: chain.mainnet.id,
      //     });
      //   } catch (error: any) {
      //     author = proposal[0];
      //   }

      //   const proposalData: any = {
      //     authorEthereumAddress: proposal[0],
      //     author: author ?? proposal[0],
      //     content: proposal[1],
      //     isContentImage: isUrlToImage(proposal[1]) ? true : false,
      //     exists: proposal[2],
      //     //@ts-ignore
      //     votes: votes?.forVotes ? votes?.forVotes / 1e18 - votes?.againstVotes / 1e18 : votes / 1e18,
      //   };

      //   setProposalData({ id: proposalId, data: proposalData });
      // }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (contestStatus !== ContestStatus.VotingOpen) {
      provider.removeAllListeners("VoteCast");
      setDisplayReloadBanner(false);
    } else {
      watchContractEvent(
        {
          addressOrName: asPath.split("/")[3],
          contractInterface: DeployedContestContract.abi,
        },
        "VoteCast",
        (...args) => {
          onVoteCast(args).catch(err => console.error(err));
        },
      );
    }

    return () => {
      provider.removeAllListeners("VoteCast");
    };
  }, [contestStatus]);

  function onVisibilityChangeHandler() {
    if (document.visibilityState === "hidden") {
      provider.removeAllListeners();
      if (contestStatus === ContestStatus.VotingOpen) setDisplayReloadBanner(true);
    } else {
      if (contestStatus === ContestStatus.VotingOpen) {
        provider.addListener("VoteCast", (...args) => {
          onVoteCast(args);
        });
      }
    }
  }

  useEffect(() => {
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
