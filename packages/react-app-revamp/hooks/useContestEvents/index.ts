import { chains } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { getEthersProvider } from "@helpers/ethers";
import { extractPathSegments } from "@helpers/extractPath";
import isUrlToImage from "@helpers/isUrlToImage";
import useContest from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { fetchEnsName, readContract, watchContractEvent } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export function useContestEvents() {
  const { asPath } = useRouter();
  const { address: contestAddress, chainName } = extractPathSegments(asPath);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const provider = getEthersProvider({ chainId });
  const { canUpdateVotesInRealTime } = useContestStore(state => state);
  const { fetchTotalVotesCast } = useContest();
  const { contestStatus } = useContestStatusStore(state => state);
  const { updateProposal } = useProposal();
  const { setProposalData, listProposalsData } = useProposalStore(state => state);
  const [displayReloadBanner, setDisplayReloadBanner] = useState(false);
  const contestStatusRef = useRef(contestStatus);
  const listProposalsDataRef = useRef(listProposalsData);

  useEffect(() => {
    listProposalsDataRef.current = listProposalsData;
  }, [listProposalsData]);

  /**
   * Callback function triggered on "VoteCast" event
   * @param args - Array of the following values: from, to, value, event|event[]
   */
  async function onVoteCast(args: Array<any>) {
    try {
      const proposalId = args[0].args.proposalId.toString();
      const votesRaw = (await readContract({
        address: contestAddress as `0x${string}`,
        abi: DeployedContestContract.abi,
        functionName: "proposalVotes",
        args: [proposalId],
      })) as bigint[];

      const forVotesBigInt = votesRaw[0];
      const againstVotesBigInt = votesRaw[1];

      const votesBigNumber = BigNumber.from(forVotesBigInt).sub(againstVotesBigInt);
      const votes = Number(utils.formatEther(votesBigNumber));

      const proposal = listProposalsDataRef.current.find(p => p.id === proposalId);

      if (proposal) {
        updateProposal(
          {
            ...proposal,
            netVotes: votes,
          },
          listProposalsDataRef.current,
        );
      } else {
        const proposal = (await readContract({
          address: contestAddress as `0x${string}`,
          abi: DeployedContestContract.abi,
          functionName: "getProposal",
          args: [proposalId],
        })) as any;

        const proposalData: any = {
          id: proposalId,
          authorEthereumAddress: proposal.author,
          content: proposal.description,
          isContentImage: isUrlToImage(proposal.description) ? true : false,
          exists: proposal.exists,
          votes,
        };

        setProposalData(proposalData);
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
    if (!canUpdateVotesInRealTime || ContestStatus.VotingOpen !== contestStatus) {
      provider.removeAllListeners("VoteCast");
      setDisplayReloadBanner(false);
    } else {
      if (ContestStatus.VotingOpen === contestStatus && canUpdateVotesInRealTime) {
        watchContractEvent(
          {
            address: contestAddress as `0x${string}`,
            abi: DeployedContestContract.abi,
            eventName: "VoteCast",
          },
          args => {
            onVoteCast(args).catch(err => console.log(err));
          },
        );
      }
    }

    return () => {
      provider.removeAllListeners("VoteCast");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUpdateVotesInRealTime]);

  return {
    displayReloadBanner,
  };
}

export default useContestEvents;
