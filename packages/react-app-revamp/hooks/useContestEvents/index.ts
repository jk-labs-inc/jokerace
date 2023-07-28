import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useEthersProvider } from "@helpers/ethers";
import isUrlToImage from "@helpers/isUrlToImage";
import useContest from "@hooks/useContest";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { chain, fetchEnsName, readContract, watchContractEvent } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export function useContestEvents() {
  const { asPath } = useRouter();
  const provider = useEthersProvider();
  const { fetchTotalVotesCast } = useContest();
  const { contestStatus } = useContestStatusStore(state => state);
  const { setProposalData, setProposalVotes, listProposalsData } = useProposalStore(state => state);
  const [displayReloadBanner, setDisplayReloadBanner] = useState(false);
  const contestStatusRef = useRef(contestStatus);

  /**
   * Callback function triggered on "VoteCast" event
   * @param args - Array of the following values: from, to, value, event|event[]
   */
  async function onVoteCast(args: Array<any>) {
    try {
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
          content: proposal[2],
          isContentImage: isUrlToImage(proposal[2]) ? true : false,
          exists: proposal[1],
          //@ts-ignore
          votes: votes?.forVotes ? votes?.forVotes / 1e18 - votes?.againstVotes / 1e18 : votes / 1e18,
        };

        setProposalData({ id: proposalId, data: proposalData });
      }

      await fetchTotalVotesCast();
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    contestStatusRef.current = contestStatus;
  }, [contestStatus]);

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
      if (contestStatusRef.current === ContestStatus.VotingOpen) {
        setDisplayReloadBanner(true);
      }
      return;
    } else {
      if (contestStatusRef.current === ContestStatus.VotingOpen) {
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
