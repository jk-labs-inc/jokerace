"use client";
import SubmissionPage from "@components/_pages/Submission";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
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
}

const Submission: FC<SubmissionProps> = ({ address, chain, submission, abi, version, chainId }) => {
  const setPickProposal = useCastVotesStore(useShallow(state => state.setPickedProposal));
  const { setContestConfig, setProposalId } = useContestConfigStore(
    useShallow(state => ({
      setContestConfig: state.setContestConfig,
      setProposalId: state.setProposalId,
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
  }, [abi, version, setContestConfig, chain, chainId, address]);

  useEffect(() => {
    setPickProposal(submission);
    setProposalId(submission);
  }, [setPickProposal, submission, setProposalId]);

  return <SubmissionPage />;
};

export default Submission;
