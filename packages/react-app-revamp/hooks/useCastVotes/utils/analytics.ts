import { addUserActionForAnalytics } from "lib/analytics/participants";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { Charge } from "@hooks/useDeployContest/types";
import { formatEther } from "viem";

interface UserAnalyticsParams {
  contestAddress: string;
  userAddress: `0x${string}` | undefined;
  chainName: string;
  pickedProposal: string | null;
  amountOfVotes: number;
  costToVote: bigint | undefined;
  charge: Charge | null;
}

interface RewardsAnalyticsParams {
  isEarningsTowardsRewards: boolean;
  address: string;
  rewardsModuleAddress: string;
  charge: Charge | null;
  chainName: string;
  costToVote: bigint | undefined;
  operation: "deposit" | "withdraw";
  token_address: string | null;
}

export interface CombinedAnalyticsParams extends UserAnalyticsParams, RewardsAnalyticsParams {}

const formatChargeAmount = (amount: number): number => {
  return Number(formatEther(BigInt(amount)));
};

export const addUserActionAnalytics = async (params: UserAnalyticsParams) => {
  try {
    await addUserActionForAnalytics({
      contest_address: params.contestAddress,
      user_address: params.userAddress,
      network_name: params.chainName,
      proposal_id: params.pickedProposal !== null ? params.pickedProposal : undefined,
      vote_amount: params.amountOfVotes,
      created_at: Math.floor(Date.now() / 1000),
      amount_sent: params.costToVote ? formatChargeAmount(parseFloat(params.costToVote.toString())) : null,
      percentage_to_creator: params.charge ? params.charge.percentageToCreator : null,
    });
  } catch (error) {
    console.error("Error in addUserActionForAnalytics:", error);
  }
};

export const updateRewardAnalyticsIfNeeded = async (
  params: RewardsAnalyticsParams,
  refetchTotalRewards: () => void,
) => {
  if (params.isEarningsTowardsRewards && params.costToVote && params.charge) {
    try {
      await updateRewardAnalytics({
        contest_address: params.address,
        rewards_module_address: params.rewardsModuleAddress,
        network_name: params.chainName,
        amount:
          formatChargeAmount(parseFloat(params.costToVote.toString())) * (params.charge.percentageToCreator / 100),
        operation: "deposit",
        token_address: null,
        created_at: Math.floor(Date.now() / 1000),
      });
    } catch (error) {
      console.error("Error while updating reward analytics", error);
    }
    refetchTotalRewards();
  }
};

export const performAnalytics = async (params: CombinedAnalyticsParams, refetchTotalRewards: () => void) => {
  try {
    await addUserActionAnalytics(params);
    await updateRewardAnalyticsIfNeeded(params, refetchTotalRewards);
  } catch (error) {
    console.error("Error in performAnalytics:", error);
  }
};
