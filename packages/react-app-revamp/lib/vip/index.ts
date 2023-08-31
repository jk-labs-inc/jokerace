import { isSupabaseConfigured } from "@helpers/database";

export const canUploadLargeAllowlist = async (userAddress: string, requiredSize: number) => {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { data, error } = await supabase
      .from("user_permissions")
      .select("allowlist_max_size, user_address")
      .eq("user_address", userAddress);

    if (error || !data[0]) return false;

    return data[0].allowlist_max_size >= requiredSize;
  }
  return false;
};
