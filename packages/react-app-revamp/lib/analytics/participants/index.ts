import { isSupabaseConfigured } from "@helpers/database";

interface SaveToAnalyticsContestParticipantsOptions {
  contest_address: string;
  user_address: `0x${string}` | undefined;
  network_name: string;
  created_at?: number;
  proposal_id?: string;
  vote_amount?: number;
  deleted?: boolean;
  amount_sent?: string | null;
  percentage_to_creator?: number | null;
}

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
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    for (let proposal_id of proposal_ids) {
      const { error: updateError } = await supabase
        .from("analytics_contest_participants_v3")
        .update({ deleted: deleted })
        .eq("contest_address", contestAddress)
        .eq("network_name", chainName)
        .eq("proposal_id", proposal_id);

      if (updateError) {
        throw new Error(updateError.message);
      }
    }
  }
};
