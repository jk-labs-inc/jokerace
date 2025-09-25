"use client";
import SubmissionPage from "@components/_pages/Submission";
import { getChainId } from "@helpers/getChainId";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useContestConfig from "@hooks/useContestConfig";
import { FC, useEffect } from "react";
import { useShallow } from "zustand/shallow";

interface SubmissionProps {
  address: string;
  chain: string;
  submission: string;
}

const Submission: FC<SubmissionProps> = ({ address, chain, submission }) => {
  const setPickProposal = useCastVotesStore(useShallow(state => state.setPickedProposal));
  const { isLoading, isError } = useContestConfig({
    address: address as `0x${string}`,
    chainName: chain,
    proposalId: submission,
  });

  useEffect(() => {
    setPickProposal(submission);
  }, [setPickProposal, submission]);

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p>error</p>;
  }

  return <SubmissionPage />;
};

export default Submission;
