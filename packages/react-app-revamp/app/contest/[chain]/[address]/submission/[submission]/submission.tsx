"use client";
import SubmissionPage from "@components/_pages/Submission";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { FC, useEffect } from "react";
import { useShallow } from "zustand/shallow";

interface SubmissionProps {
  address: string;
  chain: string;
  submission: string;
  chainId: number;
}

const Submission: FC<SubmissionProps> = ({ address, chain, submission, chainId }) => {
  const setPickProposal = useCastVotesStore(useShallow(state => state.setPickedProposal));

  useEffect(() => {
    setPickProposal(submission);
  }, [setPickProposal, submission]);

  return (
    <SubmissionPage
      contestInfo={{
        address,
        chain,
        chainId,
      }}
      proposalId={submission}
    />
  );
};

export default Submission;
