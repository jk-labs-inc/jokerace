"use client";
import SubmissionPage from "@components/_pages/Submission";
import { chains } from "@config/wagmi";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useContestAbiAndVersion from "@hooks/useGetContestAbiAndVersion";
import { FC, useEffect } from "react";

interface SubmissionProps {
  address: string;
  chain: string;
  submission: string;
}

const getChainId = (chain: string) => {
  const chainId = chains.find((c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain)?.id;

  if (chainId === undefined) {
    throw new Error(`Chain ID not found for chain: ${chain}`);
  }
  return chainId;
};

const Submission: FC<SubmissionProps> = ({ address, chain, submission }) => {
  const chainId = getChainId(chain);
  const setPickProposal = useCastVotesStore(state => state.setPickedProposal);
  const { abi: contractAbi, version: contractVersion } = useContestAbiAndVersion(address, chainId);

  useEffect(() => {
    setPickProposal(submission);
  }, [setPickProposal, submission]);

  return (
    <SubmissionPage
      contestInfo={{
        address,
        chain,
        chainId,
        version: contractVersion,
        abi: contractAbi,
      }}
      proposalId={submission}
    />
  );
};

export default Submission;
