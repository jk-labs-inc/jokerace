import { supabase } from "@config/supabase";

export async function toggleContestVisibility(
  contestAddress: string,
  networkName: string,
  userAddress: string,
  isHidden: boolean,
): Promise<void> {
  try {
    const { error } = await supabase
      .from("contests_v3")
      .update({ hidden: isHidden })
      .eq("network_name", networkName)
      .eq("address", contestAddress)
      .eq("author_address", userAddress);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}
