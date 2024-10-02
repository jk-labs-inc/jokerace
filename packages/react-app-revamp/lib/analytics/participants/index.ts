interface SaveToAnalyticsContestParticipantsOptions {
  contest_address: string;
  user_address: `0x${string}` | undefined;
  network_name: string;
  created_at?: number;
  proposal_id?: string;
  vote_amount?: number;
  deleted?: boolean;
  amount_sent?: number | null;
  percentage_to_creator?: number | null;
  comment_id?: string;
}

export const addUserActionForAnalytics = async (options: SaveToAnalyticsContestParticipantsOptions) => {
  try {
    const response = await fetch("/api/analytics/participants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error("failed to save analytics data");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error("failed to save analytics data");
    }
  } catch (error) {
    console.error("error saving analytics data:", error);
  }
};

export const saveUpdatedProposalsStatusToAnalyticsV3 = async (
  userAddress: string,
  contestAddress: string,
  chainName: string,
  proposal_ids: string[],
) => {
  try {
    const response = await fetch("/api/analytics/entry-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAddress,
        contestAddress,
        chainName,
        proposal_ids,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`failed to save updated proposal statuses: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error("failed to save updated proposal statuses");
    }
  } catch (error) {
    console.error("error saving updated proposal statuses:", error);
  }
};

export const saveUpdatedProposalsCommentStatusToAnalyticsV3 = async (
  userAddress: string,
  contestAddress: string,
  chainName: string,
  proposal_id: string,
  comment_ids: string[],
) => {
  try {
    const response = await fetch("/api/analytics/comments/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAddress,
        contestAddress,
        chainName,
        proposal_id,
        comment_ids,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`failed to save updated comment statuses: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error("failed to save updated comment statuses");
    }
  } catch (error) {
    console.error("error saving updated comment statuses:", error);
  }
};
