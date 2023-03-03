import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNetwork } from "wagmi";
import { useDeleteProposalStore } from "./store";

export function useDeleteProposal() {
  const { asPath } = useRouter();
  const { chain } = useNetwork();

  const {
    isLoading,
    isError,
    error,
    isSuccess,
    transactionData,
    pickedProposal,
    isModalOpen,
    setIsLoading,
    setIsSuccess,
    setIsError,
    setTransactionData,
  } = useDeleteProposalStore(state => state);

  async function deleteProposal() {
    const address = asPath.split("/")[3];
    const chainName = asPath.split("/")[2];
    const abi = await getContestContractVersion(address, chainName);
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false, null);
    setTransactionData(null);
    const contractConfig = {
      addressOrName: address,
      contractInterface: abi ? abi : DeployedContestContract.abi,
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
      toast.error(
        //@ts-ignore
        e?.message ?? "Something went wrong while deleting this proposal.",
      );
      console.error(e);
      setIsLoading(false);
      //@ts-ignore
      setIsError(true, e?.message ?? "Something went wrong while deleting this proposal.");
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      setIsLoading(false);
      setIsSuccess(false);
      setTransactionData({});
      setIsError(false, null);
    }
  }, [isModalOpen]);

  return {
    deleteProposal,
    isLoading,
    isError,
    error,
    isSuccess,
    transactionData,
  };
}

export default useDeleteProposal;
