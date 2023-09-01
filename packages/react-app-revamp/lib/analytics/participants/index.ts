import { isSupabaseConfigured } from "@helpers/database";

interface SaveToAnalyticsContestParticipantsV3Options {
  contest_address: string;
  user_address: `0x${string}` | undefined;
  network_name: string;
  times_proposed?: number;
  times_voted?: number;
}

interface GetAnalyticsForUserOptions {
  user_address: `0x${string}` | undefined;
  contest_address: string;
  network_name: string;
}

export const incrementUserActionForAnalytics = async (
  user_address: `0x${string}` | undefined,
  action: "proposed" | "voted",
  contest_address: string,
  network_name: string,
) => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const userData = await getAnalyticsForUser({ user_address, contest_address, network_name });

    if (userData) {
      const updatedCount =
        action === "proposed"
          ? { times_proposed: (userData.times_proposed || 0) + 1 }
          : { times_voted: (userData.times_voted || 0) + 1 };

      const { error } = await supabase
        .from("analytics_contest_participants_v3")
        .update(updatedCount)
        .eq("user_address", user_address)
        .eq("contest_address", contest_address)
        .eq("network_name", network_name);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      await saveToAnalyticsContestParticipantsV3({
        contest_address: contest_address,
        user_address: user_address,
        network_name: network_name,
        times_proposed: action === "proposed" ? 1 : 0,
        times_voted: action === "voted" ? 1 : 0,
      });
    }
  }
};

const saveToAnalyticsContestParticipantsV3 = async (options: SaveToAnalyticsContestParticipantsV3Options) => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { error } = await supabase.from("analytics_contest_participants_v3").insert(options);

    if (error) {
      throw new Error(error.message);
    }
  }
};

const getAnalyticsForUser = async (options: GetAnalyticsForUserOptions) => {
  const { user_address, contest_address, network_name } = options;

  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;

    const { data, error } = await supabase
      .from("analytics_contest_participants_v3")
      .select("times_proposed, times_voted")
      .eq("user_address", user_address)
      .eq("contest_address", contest_address)
      .eq("network_name", network_name);

    if (error) {
      throw new Error(error.message);
    }

    if (data && data.length > 0) {
      return data[0];
    }
  }
  return null;
};
