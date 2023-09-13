import { isSupabaseConfigured } from "@helpers/database";

interface SaveToAnalyticsContestParticipantsOptions {
  contest_address: string;
  user_address: `0x${string}` | undefined;
  network_name: string;
  created_at?: number;
  proposal_id?: string;
  vote_amount?: number;
}

export const addUserActionForAnalytics = async (options: SaveToAnalyticsContestParticipantsOptions) => {
  await saveToAnalyticsContestParticipantsV3(options);
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
