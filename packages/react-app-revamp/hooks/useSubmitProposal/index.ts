import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { useEthersProvider } from "@helpers/ethers";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { removeSubmissionFromLocalStorage } from "@helpers/submissionCaching";
import { useContestStore } from "@hooks/useContest/store";
import { useGenerateProof } from "@hooks/useGenerateProof";
import useProposal from "@hooks/useProposal";
import { useUserStore } from "@hooks/useUser/store";
import { prepareWriteContract, waitForTransaction, writeContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { CustomError, ErrorCodes } from "types/error";
import { Abi } from "viem";
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
  const provider = useEthersProvider({ chainId: chain?.id });

  const { asPath } = useRouter();

  async function sendProposal(proposalContent: string): Promise<TransactionResponse> {
    return new Promise<TransactionResponse>(async (resolve, reject) => {
      const [chainName, address] = asPath.split("/").slice(2, 4);
      const { abi } = await getContestContractVersion(address, provider);
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
          address: address as `0x${string}`,
          abi: abi as any,
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

        let hash = "" as `0x${string}`;
        let txConfig = null;

        // case when anyone can submit a proposal
        if (!submissionMerkleTree || submissionMerkleTree.getLeaves().length === 0) {
          txConfig = {
            ...contractConfig,
            functionName: "proposeWithoutProof",
            args: [proposalCore],
          };
        } else if (!proofVerificationStatus.verified) {
          txConfig = {
            ...contractConfig,
            functionName: "propose",
            args: [proposalCore, proofs],
          };
        } else {
          txConfig = {
            ...contractConfig,
            functionName: "proposeWithoutProof",
            args: [proposalCore],
          };
        }

        if (txConfig) {
          const txSendProposal = await writeContract(txConfig);
          hash = txSendProposal.hash;
        }

        const receipt = await waitForTransaction({
          chainId: chain?.id,
          hash,
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
        fetchProposalsIdsList(abi); // you might need to pass the ABI here

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
