import { isSupabaseConfigured } from "@helpers/database";

interface RewardAnalyticsUpdateOptions {
  contest_address: string;
  rewards_module_address: string;
  network_name: string;
  amount: number;
  operation: "deposit" | "distribute";
  token_address: string | null;
}

export const updateRewardAnalytics = async (options: RewardAnalyticsUpdateOptions) => {
  const { contest_address, rewards_module_address, network_name, token_address, amount, operation } = options;

  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    let fetchQuery = supabase
      .from("analytics_rewards_v3")
      .select("*")
      .eq("rewards_module_address", rewards_module_address)
      .eq("contest_address", contest_address)
      .eq("network_name", network_name);

    if (token_address === null) {
      fetchQuery = fetchQuery.is("token_address", null);
    } else {
      fetchQuery = fetchQuery.eq("token_address", token_address.toLowerCase());
    }

    const { data, error: fetchError } = await fetchQuery;

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    if (data && data.length > 0) {
      const entry = data[0];
      const updatePayload =
        operation === "deposit"
          ? { amount_paid_in: entry.amount_paid_in + amount }
          : { amount_paid_out: entry.amount_paid_out + amount };

      const { error: updateError } = await supabase
        .from("analytics_rewards_v3")
        .update(updatePayload)
        .eq("uuid", entry.uuid);

      if (updateError) {
        throw new Error(updateError.message);
      }
      return;
    } else {
      const insertPayload = {
        contest_address,
        rewards_module_address,
        network_name,
        token_address: token_address ? token_address.toLowerCase() : null,
        amount_paid_in: operation === "deposit" ? amount : 0,
        amount_paid_out: operation === "distribute" ? amount : 0,
      };

      const { error: insertError } = await supabase.from("analytics_rewards_v3").insert(insertPayload);

      if (insertError) {
        throw new Error(insertError.message);
      }
    }
  }
};
