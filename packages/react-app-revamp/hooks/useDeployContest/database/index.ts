import { chains, config } from "@config/wagmi";
import { isSupabaseConfigured } from "@helpers/database";
import { getAccount } from "@wagmi/core";
import { ContestValues } from "../types";

export async function getJkLabsSplitDestinationAddress(
  chainId: number,
  chargeType: { costToPropose: number; costToVote: number },
): Promise<string> {
  const chain = chains.find(c => c.id === chainId);

  if (!chain) {
    throw new Error(`Chain with id ${chainId} not found`);
  }

  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured");
  }

  const config = await import("@config/supabase");
  const supabase = config.supabase;

  const chainName = chain.name;

  const { data, error } = await supabase
    .from("chain_params")
    .select("jk_labs_split_destination")
    .eq("network_name", chainName.toLowerCase())
    .single();

  if (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }

  if (!data) {
    throw new Error(`No data found for chain ${chainName}`);
  }

  return data.jk_labs_split_destination;
}

export async function indexContest(contestData: ContestValues) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured");
  }

  const { address } = getAccount(config);
  const supabaseConfig = await import("@config/supabase");
  const supabase = supabaseConfig.supabase;

  const { error } = await supabase.from("contests_v3").insert([
    {
      created_at: new Date().toISOString(),
      start_at: contestData.datetimeOpeningSubmissions.toISOString(),
      vote_start_at: contestData.datetimeOpeningVoting.toISOString(),
      end_at: contestData.datetimeClosingVoting.toISOString(),
      title: contestData.title,
      prompt: contestData.prompt,
      address: contestData.contractAddress,
      anyone_can_submit: contestData.anyoneCanSubmit,
      votingMerkleRoot: null,
      submissionMerkleRoot: null,
      author_address: contestData?.authorAddress ?? address,
      network_name: contestData.networkName,
      featured: contestData.featured ?? false,
      voting_requirements: null,
      cost_to_propose: contestData.cost_to_propose,
      cost_to_vote: contestData.cost_to_vote,
      percentage_to_creator: contestData.percentage_to_creator,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }
}
