import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { extractPathSegments } from "@helpers/extractPath";
import { getProposalId } from "@helpers/getProposalId";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { useGenerateProof } from "@hooks/useGenerateProof";
import { MetadataFieldWithInput, useMetadataStore } from "@hooks/useMetadataFields/store";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useSubmitProposalStore } from "./store";
import { generateFieldInputsHTML, processFieldInputs } from "@helpers/metadata";

const targetMetadata = {
  targetAddress: "0x0000000000000000000000000000000000000000",
};

const safeMetadata = {
  signers: ["0x0000000000000000000000000000000000000000"],
  threshold: 1,
};

export function useSubmitProposal() {
  const { address: userAddress, chain } = useAccount();
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const showToast = !isMobile;
  const { charge, contestAbi: abi } = useContestStore(state => state);
  const { error: errorMessage, handleError } = useError();
  const { fetchSingleProposal } = useProposal();
  const { setSubmissionsCount, submissionsCount } = useProposalStore(state => state);
  const { increaseCurrentUserProposalCount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const { isLoading, isSuccess, error, setIsLoading, setIsSuccess, setError, setTransactionData } =
    useSubmitProposalStore(state => state);
  const { fields: metadataFields, setFields: setMetadataFields } = useMetadataStore(state => state);

  const calculateChargeAmount = () => {
    if (!charge) return undefined;

    return BigInt(charge.type.costToPropose);
  };

  async function sendProposal(proposalContent: string): Promise<{ tx: TransactionResponse; proposalId: string }> {
    if (showToast) toastLoading("proposal is deploying...");
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);

    // generate the HTML for field inputs
    const fieldInputsHTML = generateFieldInputsHTML(proposalContent, metadataFields);

    // combine the original proposalContent with the generated HTML
    const fullProposalContent = `${proposalContent}\n\n${fieldInputsHTML}`;

    return new Promise<{ tx: TransactionResponse; proposalId: string }>(async (resolve, reject) => {
      const costToPropose = calculateChargeAmount();

      try {
        const { proofs, isVerified } = await getProofs(userAddress ?? "", "submission", "10");

        const contractConfig = {
          address: address as `0x${string}`,
          abi: abi,
          chainId: chain?.id,
        };

        let txSendProposal: TransactionResponse = {} as TransactionResponse;
        const fieldsMetadata = processFieldInputs(metadataFields);

        let proposalCore = {
          author: userAddress,
          exists: true,
          description: fullProposalContent,
          targetMetadata: targetMetadata,
          safeMetadata: safeMetadata,
          fieldsMetadata: fieldsMetadata,
        };

        let hash: `0x${string}`;

        if (!isVerified) {
          hash = await writeContract(config, {
            ...contractConfig,
            functionName: "propose",
            args: [proposalCore, proofs],
            value: costToPropose,
          });
        } else {
          hash = await writeContract(config, {
            ...contractConfig,
            functionName: "proposeWithoutProof",
            args: [proposalCore],
            value: costToPropose,
          });
        }

        const receipt = await waitForTransactionReceipt(config, {
          chainId: chain?.id,
          hash: hash,
        });

        const proposalId = await getProposalId(proposalCore, contractConfig);

        try {
          await addUserActionForAnalytics({
            contest_address: address,
            user_address: userAddress,
            network_name: chainName,
            proposal_id: proposalId,
            created_at: Math.floor(Date.now() / 1000),
            amount_sent: charge ? Number(formatEther(BigInt(charge.type.costToPropose))) : null,
            percentage_to_creator: charge ? charge.percentageToCreator : null,
          });
        } catch (error) {
          console.error("Error in addUserActionForAnalytics:", error);
        }

        setTransactionData({
          chainId: chain?.id,
          hash: receipt.transactionHash,
          transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txSendProposal?.hash}`,
        });

        setIsLoading(false);
        setIsSuccess(true);
        if (showToast) toastSuccess("proposal submitted successfully!");
        increaseCurrentUserProposalCount();
        setSubmissionsCount(submissionsCount + 1);
        fetchSingleProposal(proposalId);

        if (metadataFields.length > 0) {
          const clearedFields = metadataFields.map(field => ({
            ...field,
            inputValue: "",
          }));
          setMetadataFields(clearedFields);
        }

        resolve({ tx: txSendProposal, proposalId });
      } catch (e) {
        handleError(e, `Something went wrong while submitting your proposal.`);
        setError(errorMessage);
        setIsLoading(false);
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
