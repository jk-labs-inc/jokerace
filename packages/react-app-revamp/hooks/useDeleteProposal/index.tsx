import { chains } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useProposalStore } from "@hooks/useProposal/store";
import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CustomError } from "types/error";
import { useNetwork } from "wagmi";
import { useDeleteProposalStore } from "./store";

export function useDeleteProposal() {
  const { asPath } = useRouter();
  const { chain } = useNetwork();
  const softDeleteProposal = useProposalStore(state => state.softDeleteProposal);
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

  async function deleteProposal(proposalId: string) {
    const address = asPath.split("/")[3];
    const chainName = asPath.split("/")[2];
    const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;

    const abi = await getContestContractVersion(address, chainId);

    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);
    const contractConfig = {
      address: address as `0x${string}`,
      abi: abi ? abi.abi : DeployedContestContract.abi,
    };

    try {
      const txDeleteProposals = await writeContract({
        ...contractConfig,
        functionName: "deleteProposals",
        args: [[proposalId]],
      });

      const receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txDeleteProposals.hash,
      });

      setTransactionData({
        hash: receipt.transactionHash,
        chainId: chain?.id,
        transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txDeleteProposals?.hash}`,
      });
      setIsLoading(false);
      setIsSuccess(true);
      softDeleteProposal(proposalId);
      toast.success(`Proposal deleted successfully!`);
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      const message = customError.message || "Something went wrong while deleting your proposal.";
      toast.error(message);
      setError({
        code: customError.code,
        message,
      });
      setIsLoading(false);
    }
  }

  async function isProposalDeleted(proposalId: string) {
    const address = asPath.split("/")[3];
    const chainName = asPath.split("/")[2];
    const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;

    const abi = await getContestContractVersion(address, chainId);

    const contractConfig = {
      address: address as `0x${string}`,
      abi: abi ? abi.abi : DeployedContestContract.abi,
    };

    try {
      const isProposalDeleted = (await readContract({
        ...contractConfig,
        functionName: "isProposalDeleted",
        args: [proposalId],
      })) as number;

      return isProposalDeleted;
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      const message = customError.message || "Something went wrong while deleting your proposal.";
      toast.error(message);
      setError({
        code: customError.code,
        message,
      });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      setIsLoading(false);
      setIsSuccess(false);
      setTransactionData({});
      setError(null);
    }
  }, [isModalOpen, setError, setIsLoading, setIsSuccess, setTransactionData]);

  return {
    deleteProposal,
    isProposalDeleted,
    isLoading,
    error,
    isSuccess,
    transactionData,
  };
}

export default useDeleteProposal;
