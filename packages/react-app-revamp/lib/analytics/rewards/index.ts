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
  try {
    const response = await fetch("/api/analytics/rewards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`failed to update reward analytics: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error("failed to update reward analytics");
    }
  } catch (error) {
    console.error("error updating reward analytics:", error);
    throw error;
  }
};
