import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { saveUpdatedProposalsStatusToAnalyticsV3 } from "lib/analytics/participants";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useDeleteProposalStore } from "./store";

export function useDeleteProposal() {
  const { contestAbi: abi } = useContestStore(state => state);
  const { address: userAddress, chain } = useAccount();
  const { asPath } = useRouter();
  const { chainName, address } = extractPathSegments(asPath);
  const { removeProposal } = useProposal();
  const { submissionsCount, setSubmissionsCount } = useProposalStore(state => state);
  const {
    isLoading,
    error,
    isSuccess,
    transactionData,
    isModalOpen,
    setIsLoading,
    setIsSuccess,
    setError,
    setTransactionData,
  } = useDeleteProposalStore(state => state);
  const { error: errorMessage, handleError } = useError();

  async function deleteProposal(proposalIds: string[]) {
    toastLoading(`Deleting proposal...`);
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);

    const contractConfig = {
      address: address as `0x${string}`,
      abi: abi ? abi : (DeployedContestContract.abi as Abi),
    };

    if (!contractConfig.abi) return;

    try {
      const { request } = await simulateContract(config, {
        ...contractConfig,
        functionName: "deleteProposals",
        args: [proposalIds],
      });

      const hash = await writeContract(config, {
        ...request,
      });

      const receipt = await waitForTransactionReceipt(config, {
        chainId: chain?.id,
        hash: hash,
      });

      setTransactionData({
        hash: receipt.transactionHash,
        chainId: chain?.id,
        transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${hash}`,
      });

      try {
        if (!userAddress) return;

        await saveUpdatedProposalsStatusToAnalyticsV3(userAddress, address, chainName, proposalIds);
      } catch (error: any) {
        console.error("Error saving updated proposals status to analytics", error.message);
      }

      removeProposal(proposalIds);
      setSubmissionsCount(submissionsCount - proposalIds.length);
      setIsLoading(false);
      setIsSuccess(true);
      toastSuccess(`Proposal deleted successfully!`);
    } catch (e) {
      handleError(e, `something went wrong and the proposal couldn't be deleted`);
      setError(errorMessage);
      setIsLoading(false);
      setIsSuccess(false);
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      setIsLoading(false);
      setIsSuccess(false);
      setTransactionData({});
      setError("");
    }
  }, [isModalOpen, setError, setIsLoading, setIsSuccess, setTransactionData]);

  return {
    deleteProposal,
    isLoading,
    error,
    isSuccess,
    transactionData,
  };
}

export default useDeleteProposal;
