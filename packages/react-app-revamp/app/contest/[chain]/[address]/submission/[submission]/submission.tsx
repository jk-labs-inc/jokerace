"use client";
import SubmissionPage from "@components/_pages/Submission";
import { getChainId } from "@helpers/getChainId";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useContestAbiAndVersion from "@hooks/useContestAbiAndVersion";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { FC, useEffect } from "react";
import { Abi } from "viem";
import { useShallow } from "zustand/shallow";

interface SubmissionProps {
  address: string;
  chain: string;
  submission: string;
}

const Submission: FC<SubmissionProps> = ({ address, chain, submission }) => {
  const setPickProposal = useCastVotesStore(useShallow(state => state.setPickedProposal));
  const chainId = getChainId(chain);
  const { abi, version, isLoading, isError } = useContestAbiAndVersion({
    address: address as `0x${string}`,
    chainId: chainId,
  });
  const { setContestConfig, setProposalId } = useContestConfigStore(
    useShallow(state => ({
      setContestConfig: state.setContestConfig,
      setProposalId: state.setProposalId,
    })),
  );

  useEffect(() => {
    if (isLoading || isError) return;

    setContestConfig({
      address: address as `0x${string}`,
      chainName: chain,
      chainId,
      chainNativeCurrencySymbol: getNativeTokenSymbol(chain) ?? "",
      abi: abi as Abi,
      version,
    });
  }, [abi, version, setContestConfig, chain, chainId, address]);

  useEffect(() => {
    setPickProposal(submission);
    setProposalId(submission);
  }, [setPickProposal, submission]);

  // TODO: add loading and error states
  if (isLoading) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p>error</p>;
  }

  return <SubmissionPage />;
};

export default Submission;
