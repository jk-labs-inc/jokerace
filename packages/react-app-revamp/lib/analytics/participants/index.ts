import { isSupabaseConfigured } from "@helpers/database";
import { getTimestampFromReceiptWithRetries } from "@helpers/timestamp";
import { TransactionReceipt } from "viem";

interface SaveToAnalyticsContestParticipantsOptions {
  contest_address: string;
  user_address: `0x${string}` | undefined;
  network_name: string;
  created_at?: number;
  proposal_id?: string;
  vote_amount?: number;
}

export const addUserActionForAnalytics = async (
  options: SaveToAnalyticsContestParticipantsOptions,
  receipt?: TransactionReceipt,
  chainId?: number,
) => {
  let createdAt = Math.floor(Date.now() / 1000);

  if (receipt && chainId) {
    try {
      createdAt = await getTimestampFromReceiptWithRetries(receipt, chainId, 5);
    } catch (error) {
      console.error("failed to retrieve timestamp, using fallbvack value", error);
    }
  } else {
    console.error("receipt or chainId is missing");
  }

  await saveToAnalyticsContestParticipantsV3({
    ...options,
    created_at: createdAt,
  });
};

const saveToAnalyticsContestParticipantsV3 = async (options: SaveToAnalyticsContestParticipantsOptions) => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { error } = await supabase.from("analytics_contest_participants_v3").insert(options);

    if (error) {
      throw new Error(error.message);
    }
  }
};
