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
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useDeleteProposalStore } from "./store";
import { ContestStatus } from "@hooks/useContestStatus/store";
import { compareVersions } from "compare-versions";

export const ENTRANT_CAN_DELETE_VERSION = "5.3";

export function useDeleteProposal() {
  const { contestAbi: abi, version } = useContestStore(state => state);
  const { address: userAddress } = useAccount();
  const asPath = usePathname();
  const { address, chainName } = extractPathSegments(asPath ?? "");
  const chain = chains.filter(chain => chain.name.toLowerCase() === chainName.toLowerCase())[0];
  const contestChainId = chain.id;
  const contestChainBlockExplorer = chain.blockExplorers?.default?.url;
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
    resetStore,
  } = useDeleteProposalStore(state => state);
  const { error: errorMessage, handleError } = useError();

  async function deleteProposal(proposalIds: string[]) {
    toastLoading({
      message: "Deleting proposal...",
    });
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);

    const contractConfig = {
      address: address as `0x${string}`,
      abi: abi ? abi : (DeployedContestContract.abi as Abi),
      chainId: contestChainId,
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
        chainId: contestChainId,
        hash: hash,
      });

      setTransactionData({
        hash: receipt.transactionHash,
        chainId: contestChainId,
        transactionHref: `${contestChainBlockExplorer}/tx/${hash}`,
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
      toastSuccess({
        message: "Proposal deleted successfully!",
      });
    } catch (e) {
      handleError(e, `something went wrong and the proposal couldn't be deleted`);
      setError(errorMessage);
      setIsLoading(false);
      setIsSuccess(false);
    }
  }

  function isEntrantCanDeleteVersion() {
    return compareVersions(version, ENTRANT_CAN_DELETE_VERSION) >= 0;
  }

  function canDeleteProposal(
    userAddress: string | undefined,
    contestAuthorAddress: string,
    proposalAuthorAddress: string,
    contestStatus: ContestStatus,
  ) {
    const isContestAuthor = userAddress === contestAuthorAddress;
    const isProposalAuthor = userAddress === proposalAuthorAddress;
    const canEntrantDelete = isEntrantCanDeleteVersion();

    return (
      contestStatus === ContestStatus.SubmissionOpen && (isContestAuthor || (canEntrantDelete && isProposalAuthor))
    );
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
    isEntrantCanDeleteVersion,
    canDeleteProposal,
    resetStore,
  };
}

export default useDeleteProposal;
