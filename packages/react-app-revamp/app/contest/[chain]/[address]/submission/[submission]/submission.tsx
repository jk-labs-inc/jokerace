"use client";
import SubmissionPage from "@components/_pages/Submission";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { ContestVoteTimings, ProposalStaticData } from "lib/submission";
import { FC, useEffect } from "react";
import { Abi } from "viem";
import { useShallow } from "zustand/shallow";

interface SubmissionProps {
  address: string;
  chain: string;
  submission: string;
  abi: Abi;
  version: string;
  chainId: number;
  proposalStaticData: ProposalStaticData;
  contestDetails: {
    author: string;
    name: string;
  } | null;
  allProposalIds: string[];
  voteTimings: ContestVoteTimings | null;
}

const Submission: FC<SubmissionProps> = ({
  address,
  chain,
  submission,
  abi,
  version,
  chainId,
  proposalStaticData,
  contestDetails,
  allProposalIds,
  voteTimings,
}) => {
  const setPickProposal = useCastVotesStore(useShallow(state => state.setPickedProposal));
  const { setContestConfig, setProposalId } = useContestConfigStore(
    useShallow(state => ({
      setContestConfig: state.setContestConfig,
      setProposalId: state.setProposalId,
    })),
  );
  const { setProposalStaticData, setContestDetails, setAllProposalIds, setVoteTimings, resetStore } =
    useSubmissionPageStore(
      useShallow(state => ({
        setProposalStaticData: state.setProposalStaticData,
        setContestDetails: state.setContestDetails,
        setAllProposalIds: state.setAllProposalIds,
        setVoteTimings: state.setVoteTimings,
        resetStore: state.resetStore,
      })),
    );

  useEffect(() => {
    setContestConfig({
      address: address as `0x${string}`,
      chainName: chain,
      chainId,
      chainNativeCurrencySymbol: getNativeTokenSymbol(chain) ?? "",
      abi,
      version,
    });
  }, [abi, version, chain, chainId, address]);

  useEffect(() => {
    setPickProposal(submission);
    setProposalId(submission);
  }, [submission]);

  useEffect(() => {
    setProposalStaticData(proposalStaticData);
    setContestDetails(contestDetails ?? { author: null, name: null });
    setAllProposalIds(allProposalIds);
    setVoteTimings(voteTimings);
  }, [proposalStaticData, contestDetails, allProposalIds, voteTimings]);

  useEffect(() => {
    return () => {
      resetStore();
    };
  }, [resetStore]);

  return <SubmissionPage />;
};

export default Submission;
