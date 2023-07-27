import { toastError } from "@components/UI/Toast";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { CustomError } from "types/error";
import { useNetwork } from "wagmi";
import { useDeleteProposalStore } from "./store";

export function useDeleteProposal() {
  const { asPath } = useRouter();
  const { chain } = useNetwork();

  const {
    isLoading,
    error,
    isSuccess,
    transactionData,
    pickedProposal,
    isModalOpen,
    setIsLoading,
    setIsSuccess,
    setError,
    setTransactionData,
  } = useDeleteProposalStore(state => state);

  async function deleteProposal() {
    const address = asPath.split("/")[3];
    const chainName = asPath.split("/")[2];
    const { abi, version } = await getContestContractVersion(address, chainName);

    setIsLoading(true);
    setIsSuccess(false);
    setError(null);
    setTransactionData(null);
    const contractConfig = {
      address: address as `0x${string}`,
      abi: abi ? abi : DeployedContestContract.abi,
    };
    try {
      const txCastVotes = await writeContract({
        ...contractConfig,
        functionName: "deleteProposals",
        args: [[pickedProposal]],
      });
      const receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txCastVotes.hash,
      });
      setTransactionData({
        hash: receipt.transactionHash,
        chainId: chain?.id,
        transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txCastVotes?.hash}`,
      });
      setIsLoading(false);
      setIsSuccess(true);
      toast.success(`Proposal deleted successfully!`);
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      toastError("Something went wrong while deleting your proposal.", customError.message);
      setError({
        code: customError.code,
        message: customError.message,
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
  }, [isModalOpen]);

  return {
    deleteProposal,
    isLoading,
    error,
    isSuccess,
    transactionData,
  };
}

export default useDeleteProposal;
