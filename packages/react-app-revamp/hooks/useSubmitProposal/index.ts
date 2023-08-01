import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { removeSubmissionFromLocalStorage } from "@helpers/submissionCaching";
import { useContestStore } from "@hooks/useContest/store";
import { useGenerateProof } from "@hooks/useGenerateProof";
import useProposal from "@hooks/useProposal";
import { useUserStore } from "@hooks/useUser/store";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { CustomError, ErrorCodes } from "types/error";
import { useAccount, useNetwork } from "wagmi";
import { useSubmitProposalStore } from "./store";

const targetMetadata = {
  targetAddress: "0x0000000000000000000000000000000000000000",
};

const safeMetadata = {
  signers: ["0x0000000000000000000000000000000000000000"],
  threshold: 1,
};

export function useSubmitProposal() {
  const { address: userAddress } = useAccount();
  const { fetchProposalsIdsList } = useProposal();
  const { submissionMerkleTree } = useContestStore(state => state);
  const { increaseCurrentUserProposalCount } = useUserStore(state => state);
  const { checkIfProofIsVerified } = useGenerateProof();

  const { isLoading, isSuccess, error, setIsLoading, setIsSuccess, setError, setTransactionData } =
    useSubmitProposalStore(state => state);
  const { chain } = useNetwork();
  const { asPath } = useRouter();

  async function sendProposal(proposalContent: string): Promise<TransactionResponse> {
    return new Promise<TransactionResponse>(async (resolve, reject) => {
      const [chainName, address] = asPath.split("/").slice(2, 4);
      const { abi } = await getContestContractVersion(address, chainName);
      const proofVerificationStatus = await checkIfProofIsVerified(
        submissionMerkleTree,
        userAddress ?? "",
        "submission",
      );

      toastLoading("proposal is deploying...");
      setIsLoading(true);
      setIsSuccess(false);
      setError(null);
      setTransactionData(null);

      let proofs: string[] = [];

      if (!submissionMerkleTree || submissionMerkleTree.getLeaves().length === 0) {
        proofs = [];
      } else {
        proofs = proofVerificationStatus.proofs;
      }

      try {
        const contractConfig = {
          addressOrName: address,
          contractInterface: abi,
          chainId: chain?.id,
        };

        let txSendProposal: TransactionResponse = {} as TransactionResponse;

        let proposalCore = {
          author: userAddress,
          exists: true,
          description: proposalContent,
          targetMetadata: targetMetadata,
          safeMetadata: safeMetadata,
        };

        // case when anyone can submit a proposal
        if (!submissionMerkleTree || submissionMerkleTree.getLeaves().length === 0) {
          txSendProposal = await writeContract({
            ...contractConfig,
            functionName: "proposeWithoutProof",
            args: [proposalCore],
          });
        } else if (!proofVerificationStatus.verified) {
          txSendProposal = await writeContract({
            ...contractConfig,
            functionName: "propose",
            args: [proposalCore, proofs],
          });
        } else {
          txSendProposal = await writeContract({
            ...contractConfig,
            functionName: "proposeWithoutProof",
            args: [proposalCore],
          });
        }

        const receipt = await waitForTransaction({
          chainId: chain?.id,
          hash: txSendProposal.hash,
        });

        setTransactionData({
          chainId: chain?.id,
          hash: receipt.transactionHash,
          transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txSendProposal?.hash}`,
        });

        setIsLoading(false);
        setIsSuccess(true);
        toastSuccess("proposal submitted successfully!");
        increaseCurrentUserProposalCount();
        removeSubmissionFromLocalStorage("submissions", address);
        fetchProposalsIdsList(abi);

        resolve(txSendProposal);
      } catch (e) {
        const customError = e as CustomError;

        if (!customError) return;

        if (customError.code === ErrorCodes.USER_REJECTED_TX) {
          toastDismiss();
          setIsLoading(false);
          return;
        }

        toastError("Something went wrong while submitting your proposal.", customError.message);
        setError({
          code: customError.code,
          message: customError.message,
        });
        setIsLoading(false);
        reject(e);
      }
    });
  }

  return {
    sendProposal,
    isLoading,
    isSuccess,
    error,
  };
}

export default useSubmitProposal;
