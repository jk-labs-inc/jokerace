import { isSupabaseConfigured } from "@helpers/database";

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

const saveToAnalyticsContestParticipantsV3 = async (options: SaveToAnalyticsContestParticipantsOptions) => {
  if (isSupabaseConfigured) {
    try {
      const config = await import("@config/supabase");
      const supabase = config.supabase;

      const { error } = await supabase.from("analytics_contest_participants_v3").insert(options);
      if (error) {
        console.error("Error in saveToAnalyticsContestParticipantsV3:", error.message);
      }
    } catch (e) {
      console.error("Unexpected error in saveToAnalyticsContestParticipantsV3:", e);
    }
  }
};

export const addUserActionForAnalytics = async (options: SaveToAnalyticsContestParticipantsOptions) => {
  await saveToAnalyticsContestParticipantsV3(options);
};

export const saveUpdatedProposalsStatusToAnalyticsV3 = async (
  contestAddress: string,
  chainName: string,
  proposal_ids: string[],
  deleted: boolean,
) => {
  if (isSupabaseConfigured) {
    try {
      const config = await import("@config/supabase");
      const supabase = config.supabase;

      for (let proposal_id of proposal_ids) {
        const { error } = await supabase
          .from("analytics_contest_participants_v3")
          .update({ deleted: deleted })
          .eq("contest_address", contestAddress)
          .eq("network_name", chainName)
          .eq("proposal_id", proposal_id);

        if (error) {
          console.error("Error updating analytics for proposal:", proposal_id, "; Error:", error.message);
        }
      }
    } catch (e) {
      console.error("Unexpected error in saveUpdatedProposalsStatusToAnalyticsV3:", e);
    }
  }
};
