import { waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useNetwork } from "wagmi";
import { useStore } from "./store";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useEffect } from "react";
import getContestContractVersion from "@helpers/getContestContractVersion";

export function useDeleteProposal() {
  const { asPath } = useRouter();
  const { chain } = useNetwork();
  const {
    //@ts-ignore
    isModalOpen,
    //@ts-ignore
    isLoading,
    //@ts-ignore
    isError,
    //@ts-ignore
    error,
    //@ts-ignore
    isSuccess,
    //@ts-ignore
    transactionData,
    //@ts-ignore
    setIsLoading,
    //@ts-ignore
    setIsSuccess,
    //@ts-ignore
    setIsError,
    //@ts-ignore
    setTransactionData,
    //@ts-ignore
    //@ts-ignore
    pickedProposal,
  } = useStore();

  async function deleteProposal() {
    const address = asPath.split("/")[3];
    const chainName = asPath.split("/")[2];
    const abi = await getContestContractVersion(address, chainName);
    setIsLoading(true);
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
        //@ts-ignore
        hash: txCastVotes.hash,
      });
      setTransactionData({
        hash: receipt.transactionHash,
        chainId: chain?.id,
        //@ts-ignore
        transactionHref: `${chain.blockExplorers?.default?.url}/tx/${txCastVotes?.hash}`,
      });
      setIsLoading(false);
      setIsSuccess(true);
      toast.success(`Proposal deleted successfully!`);
    } catch (e) {
      toast.error(
        //@ts-ignore
        e?.data?.message ?? "Something went wrong while deleting this proposal.",
      );
      console.error(e);
      setIsLoading(false);
      //@ts-ignore
      setIsError(true, e?.data?.message ?? "Something went wrong while deleting this proposal.");
    }
  }

  useEffect(() => {
    if (isModalOpen === false) {
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
