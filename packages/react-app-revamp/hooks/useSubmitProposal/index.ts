import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { config } from "@config/wagmi";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { extractPathSegments } from "@helpers/extractPath";
import { getProposalId } from "@helpers/getProposalId";
import { generateFieldInputsHTML, processFieldInputs } from "@helpers/metadata";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { useGenerateProof } from "@hooks/useGenerateProof";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useRewardsModule from "@hooks/useRewards";
import { useUserStore } from "@hooks/useUser/store";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useSubmitProposalStore } from "./store";
import { Charge } from "@hooks/useDeployContest/types";

const targetMetadata = {
  targetAddress: "0x0000000000000000000000000000000000000000",
};

const safeMetadata = {
  signers: ["0x0000000000000000000000000000000000000000"],
  threshold: 1,
};

interface UserAnalyticsParams {
  address: string;
  userAddress: `0x${string}` | undefined;
  chainName: string;
  proposalId: string;
  charge: Charge | null;
}

interface RewardsAnalyticsParams {
  isEarningsTowardsRewards: boolean;
  address: string;
  rewardsModuleAddress: string;
  charge: Charge | null;
  chainName: string;
  amount: number;
  operation: "deposit" | "withdraw";
  token_address: string | null;
}

interface CombinedAnalyticsParams extends UserAnalyticsParams, RewardsAnalyticsParams {}

export function useSubmitProposal() {
  const { address: userAddress, chain } = useAccount();
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const showToast = !isMobile;
  const { charge, contestAbi: abi, rewardsModuleAddress } = useContestStore(state => state);
  const { error: errorMessage, handleError } = useError();
  const { fetchSingleProposal } = useProposal();
  const { setSubmissionsCount, submissionsCount } = useProposalStore(state => state);
  const { increaseCurrentUserProposalCount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const { isLoading, isSuccess, error, setIsLoading, setIsSuccess, setError, setTransactionData } =
    useSubmitProposalStore(state => state);
  const { fields: metadataFields, setFields: setMetadataFields } = useMetadataStore(state => state);
  const isEarningsTowardsRewards = rewardsModuleAddress === charge?.splitFeeDestination.address;
  const { handleRefetchBalanceRewardsModule } = useRewardsModule();

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

        setTransactionData({
          chainId: chain?.id,
          hash: receipt.transactionHash,
          transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txSendProposal?.hash}`,
        });

        await performAnalytics({
          address,
          userAddress,
          chainName,
          proposalId,
          charge,
          isEarningsTowardsRewards,
          rewardsModuleAddress,
          amount: costToPropose ? Number(formatEther(costToPropose)) : 0,
          operation: "deposit",
          token_address: null,
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

  async function addUserActionAnalytics(params: UserAnalyticsParams) {
    try {
      await addUserActionForAnalytics({
        contest_address: params.address,
        user_address: params.userAddress,
        network_name: params.chainName,
        proposal_id: params.proposalId,
        created_at: Math.floor(Date.now() / 1000),
        amount_sent: params.charge ? Number(formatEther(BigInt(params.charge.type.costToPropose))) : null,
        percentage_to_creator: params.charge ? params.charge.percentageToCreator : null,
      });
    } catch (error) {
      console.error("Error in addUserActionForAnalytics:", error);
    }
  }

  async function updateRewardAnalyticsIfNeeded(params: RewardsAnalyticsParams) {
    if (params.isEarningsTowardsRewards && params.charge) {
      try {
        await updateRewardAnalytics({
          contest_address: params.address,
          rewards_module_address: params.rewardsModuleAddress,
          network_name: params.chainName,
          amount: Number(formatEther(BigInt(params.charge.type.costToPropose))) / 2,
          operation: "deposit",
          token_address: null,
          created_at: Math.floor(Date.now() / 1000),
        });

        handleRefetchBalanceRewardsModule();
      } catch (error) {
        console.error("Error while updating reward analytics", error);
      }
    }
  }

  async function performAnalytics(params: CombinedAnalyticsParams) {
    await Promise.all([addUserActionAnalytics(params), updateRewardAnalyticsIfNeeded(params)]);
  }

  return {
    sendProposal,
    isLoading,
    isSuccess,
    error,
  };
}

export default useSubmitProposal;
