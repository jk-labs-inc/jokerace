"use client";
import SubmissionPage from "@components/_pages/Submission";
import { chains } from "@config/wagmi";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { FC, useEffect } from "react";
import { Abi } from "viem";
interface SubmissionProps {
  abi: Abi;
  version: string;
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

const Submission: FC<SubmissionProps> = ({ address, chain, submission, abi, version }) => {
  const chainId = getChainId(chain);
  const setPickProposal = useCastVotesStore(state => state.setPickedProposal);

  useEffect(() => {
    setPickProposal(submission);
  }, [setPickProposal, submission]);

  return (
    <SubmissionPage
      contestInfo={{
        address,
        chain,
        chainId,
        version,
        abi,
      }}
      proposalId={submission}
    />
  );
};

export default Submission;
