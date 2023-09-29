import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { removeSubmissionFromLocalStorage } from "@helpers/submissionCaching";
import { useError } from "@hooks/useError";
import { useGenerateProof } from "@hooks/useGenerateProof";
import useProposal from "@hooks/useProposal";
import { useUserStore } from "@hooks/useUser/store";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { useRouter } from "next/router";
import { TransactionReceipt } from "viem";
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
  const { asPath, ...router } = useRouter();
  const { address: userAddress } = useAccount();
  const { error: errorMessage, handleError } = useError();
  const { fetchSingleProposal } = useProposal();
  const { increaseCurrentUserProposalCount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const [chainName, address] = asPath.split("/").slice(2, 4);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.[0]
    ?.id;
  const { isLoading, isSuccess, error, setIsLoading, setIsSuccess, setError, setTransactionData } =
    useSubmitProposalStore(state => state);
  const { chain } = useNetwork();

  async function sendProposal(proposalContent: string): Promise<{ tx: TransactionResponse; proposalId: string }> {
    toastLoading("proposal is deploying...");
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);

    return new Promise<{ tx: TransactionResponse; proposalId: string }>(async (resolve, reject) => {
      const { abi } = await getContestContractVersion(address, chainId);

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
        const proposalId = getProposalIdFromReceipt(receipt, abi);

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
        fetchSingleProposal(proposalId);
        resolve({ tx: txSendProposal, proposalId });

        addUserActionForAnalytics({
          contest_address: address,
          user_address: userAddress,
          network_name: chainName,
          proposal_id: proposalId,
          created_at: Math.floor(Date.now() / 1000),
        });
      } catch (e) {
        handleError(e, `Something went wrong while submitting your proposal.`);
        setError(errorMessage);
        setIsLoading(false);
      }
    });
  }

  function getProposalIdFromReceipt(receipt: TransactionReceipt, abi: any): string {
    const iface = new utils.Interface(abi);
    const log = receipt.logs[0];
    const event = iface.parseLog(log);

    const proposalIdDecimal = BigNumber.from(event.args.proposalId).toString();

    return proposalIdDecimal;
  }

  return {
    sendProposal,
    isLoading,
    isSuccess,
    error,
  };
}

export default useSubmitProposal;
