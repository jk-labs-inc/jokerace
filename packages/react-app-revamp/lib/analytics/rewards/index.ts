import { isSupabaseConfigured } from "@helpers/database";

type RewardOperation = "deposit" | "distribute" | "withdraw";

interface RewardAnalyticsUpdateOptions {
  contest_address: string;
  rewards_module_address: string;
  network_name: string;
  amount: number;
  operation: RewardOperation;
  token_address: string | null;
  created_at?: number;
}

export const updateRewardAnalytics = async (options: RewardAnalyticsUpdateOptions) => {
  const { contest_address, rewards_module_address, network_name, token_address, amount, operation, created_at } =
    options;

  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const insertPayload = {
      contest_address: contest_address.toLowerCase(),
      rewards_module_address,
      network_name,
      token_address: token_address ? token_address.toLowerCase() : null,
      amount_paid_in: operation === "deposit" ? amount : null,
      amount_paid_out: operation === "distribute" ? amount : null,
      amount_withdrawn: operation === "withdraw" ? amount : null,
      created_at,
    };

    const { error: insertError } = await supabase.from("analytics_rewards_v3").insert(insertPayload);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
};
