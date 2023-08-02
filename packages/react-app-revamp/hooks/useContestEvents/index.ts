import { chains } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { getEthersProvider } from "@helpers/ethers";
import isUrlToImage from "@helpers/isUrlToImage";
import useContest from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { fetchEnsName, readContract, watchContractEvent } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export function useContestEvents() {
  const { asPath } = useRouter();
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id;
  const provider = getEthersProvider({ chainId });
  const { canUpdateVotesInRealTime } = useContestStore(state => state);
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
        address: asPath.split("/")[3] as `0x${string}`,
        abi: DeployedContestContract.abi,
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
        const proposal = (await readContract({
          address: asPath.split("/")[3] as `0x${string}`,
          abi: DeployedContestContract.abi,
          functionName: "getProposal",
          args: proposalId,
        })) as any;

        let author;
        try {
          author = await fetchEnsName({
            address: proposal[0] as `0x${string}`,
            chainId: 1,
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

  //@TODO event listeners
  useEffect(() => {
    if (!canUpdateVotesInRealTime || ContestStatus.VotingOpen !== contestStatus) {
      provider.removeAllListeners("VoteCast");
      setDisplayReloadBanner(false);
    } else {
      if (ContestStatus.VotingOpen === contestStatus && canUpdateVotesInRealTime) {
        watchContractEvent(
          {
            address: asPath.split("/")[3] as `0x${string}`,
            abi: DeployedContestContract.abi,
            eventName: "VoteCast",
          },
          "VoteCast",
          (...args) => {
            onVoteCast(args).catch(err => console.error(err));
          },
        );
      }
    }

    return () => {
      provider.removeAllListeners("VoteCast");
    };
  }, [contestStatus, canUpdateVotesInRealTime]);

  function onVisibilityChangeHandler() {
    if (document.visibilityState === "hidden") {
      provider.removeAllListeners();
      if (contestStatusRef.current === ContestStatus.VotingOpen && canUpdateVotesInRealTime) {
        setDisplayReloadBanner(true);
      }
      return;
    } else {
      if (contestStatusRef.current === ContestStatus.VotingOpen && canUpdateVotesInRealTime) {
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
  }, [canUpdateVotesInRealTime]);

  return {
    displayReloadBanner,
  };
}

export default useContestEvents;
