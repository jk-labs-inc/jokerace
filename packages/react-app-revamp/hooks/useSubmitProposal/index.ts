import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
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
import { CustomError } from "types/error";
import { useAccount, useNetwork } from "wagmi";
import { useSubmitProposalStore } from "./store";

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
      const targetMetadata = {
        targetAddress: "0x0000000000000000000000000000000000000000",
      };

      const safeMetadata = {
        signers: ["0x0000000000000000000000000000000000000000"],
        threshold: 1,
      };

      setIsLoading(true);
      setIsSuccess(false);
      setError(null);
      setTransactionData(null);

      let proofs: string[] = [];

      if (!submissionMerkleTree || submissionMerkleTree.getLeaves().length === 0) {
        proofs = [];
      } else {
        proofs = await checkIfProofIsVerified(submissionMerkleTree, userAddress ?? "", "submission");
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

        if (proofs.length > 0) {
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
        increaseCurrentUserProposalCount();
        removeSubmissionFromLocalStorage("submissions", address);
        fetchProposalsIdsList(abi); // you might need to pass the ABI here

        resolve(txSendProposal);
      } catch (e) {
        const customError = e as CustomError;

        if (!customError) return;

        const message = customError.message || "Something went wrong while submitting your proposal.";
        toast.error(message);
        setError({
          code: customError.code,
          message,
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
