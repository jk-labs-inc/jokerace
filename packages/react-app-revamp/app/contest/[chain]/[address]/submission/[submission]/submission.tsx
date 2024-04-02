"use client";
import SubmissionPage from "@components/_pages/Submission";
import useFetchProposalData from "@hooks/useFetchProposalData";
import { FC } from "react";

interface SubmissionProps {
  address: string;
  chain: string;
  chainId: number;
  abi: any;
  version: string;
  submission: string;
}

const Submission: FC<SubmissionProps> = ({ address, chain, submission, abi, version, chainId }) => {
  const { data, loading, error } = useFetchProposalData(abi, version, address, chainId, submission);

  return (
    <SubmissionPage
      contestInfo={{
        address,
        chain,
        version,
      }}
      prompt={"lol"}
      proposalData={data}
      isProposalLoading={loading}
      isProposalError={error}
      proposalId={submission}
    />
  );
};

export default Submission;
