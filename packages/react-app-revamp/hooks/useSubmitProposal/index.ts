import { toastDismiss, toastError, toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { removeSubmissionFromLocalStorage } from "@helpers/submissionCaching";
import { useGenerateProof } from "@hooks/useGenerateProof";
import useProposal from "@hooks/useProposal";
import { useUserStore } from "@hooks/useUser/store";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { incrementUserActionForAnalytics } from "lib/analytics/participants";
import { useRouter } from "next/router";
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
  const { asPath } = useRouter();
  const { address: userAddress } = useAccount();
  const { fetchProposalsIdsList } = useProposal();
  const { increaseCurrentUserProposalCount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const [chainName, address] = asPath.split("/").slice(2, 4);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.[0]
    ?.id;
  const { isLoading, isSuccess, error, setIsLoading, setIsSuccess, setError, setTransactionData } =
    useSubmitProposalStore(state => state);
  const { chain } = useNetwork();

  async function sendProposal(proposalContent: string): Promise<TransactionResponse> {
    return new Promise<TransactionResponse>(async (resolve, reject) => {
      const { abi } = await getContestContractVersion(address, chainId);
      toastLoading("proposal is deploying...");

      setIsLoading(true);
      setIsSuccess(false);
      setError(null);
      setTransactionData(null);

      try {
        const proofs = await getProofs(userAddress ?? "", "submission", "10");
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

        if (proofs) {
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

        incrementUserActionForAnalytics(userAddress, "proposed", address, chainName);

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
