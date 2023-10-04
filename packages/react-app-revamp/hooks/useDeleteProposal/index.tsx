import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useError } from "@hooks/useError";
import { useProposalStore } from "@hooks/useProposal/store";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useNetwork } from "wagmi";
import { useDeleteProposalStore } from "./store";

export function useDeleteProposal() {
  const { asPath } = useRouter();
  const { chainName, address } = extractPathSegments(asPath);
  const { chain } = useNetwork();
  const { softDeleteProposals } = useProposalStore(state => state);
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

    const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;

    const abi = await getContestContractVersion(address, chainId);

    const contractConfig = {
      address: address as `0x${string}`,
      abi: abi ? abi.abi : DeployedContestContract.abi,
    };

    try {
      //@ts-ignore
      const txDeleteProposals = await writeContract({
        ...contractConfig,
        functionName: "deleteProposals",
        args: [proposalIds],
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

      softDeleteProposals(proposalIds);
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
