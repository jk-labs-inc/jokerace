import { chains, config } from "@config/wagmi";
import { MAX_ROWS } from "@helpers/csvConstants";
import { isSupabaseConfigured } from "@helpers/database";
import { canUploadLargeAllowlist } from "lib/vip";
import { ContestValues, SubmissionMerkle, VotingMerkle } from "../types";
import { getAccount } from "@wagmi/core";

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

export async function checkForSpoofing(
  address: string,
  votingMerkle: { prefilled: VotingMerkle | null; csv: VotingMerkle | null },
  submissionMerkle: SubmissionMerkle | null,
) {
  const votingMerkleData = votingMerkle.prefilled || votingMerkle.csv;

  const exceedsVotingMaxRows = votingMerkleData && votingMerkleData.voters.length > MAX_ROWS;
  const exceedsSubmissionMaxRows = submissionMerkle && submissionMerkle.submitters.length > MAX_ROWS;

  let isVotingAllowListed = false;
  let isSubmissionAllowListed = false;

  if (exceedsVotingMaxRows) {
    isVotingAllowListed = await canUploadLargeAllowlist(address, votingMerkleData.voters.length);
    if (!isVotingAllowListed) {
      return true;
    }
  }

  if (exceedsSubmissionMaxRows) {
    isSubmissionAllowListed = await canUploadLargeAllowlist(address, submissionMerkle.submitters.length);
    if (!isSubmissionAllowListed) {
      return true;
    }
  }

  return false;
}

export async function indexContest(
  contestData: ContestValues,
  votingMerkle: VotingMerkle | null,
  submissionMerkle: SubmissionMerkle | null,
) {
  const participantsWorker = new Worker(new URL("/workers/indexContestParticipants", import.meta.url));

  try {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured");
    }

    const tasks = [];

    tasks.push(saveContestToDatabase(contestData));

    const workerData = {
      contestData,
      votingMerkle,
      submissionMerkle,
    };

    const workerTask = new Promise<void>((resolve, reject) => {
      participantsWorker.onmessage = event => {
        if (event.data.success) {
          resolve();
        } else {
          reject(new Error(event.data.error));
        }
      };

      participantsWorker.onerror = error => {
        reject(error);
      };

      participantsWorker.postMessage(workerData);
    });

    tasks.push(workerTask);

    await Promise.all(tasks);
  } catch (e: any) {
    throw e;
  } finally {
    participantsWorker.terminate();
  }
}

async function saveContestToDatabase(values: ContestValues) {
  try {
    const { address } = getAccount(config);
    const supabaseConfig = await import("@config/supabase");
    const supabase = supabaseConfig.supabase;
    const { error } = await supabase.from("contests_v3").insert([
      {
        created_at: new Date().toISOString(),
        start_at: values.datetimeOpeningSubmissions.toISOString(),
        vote_start_at: values.datetimeOpeningVoting.toISOString(),
        end_at: values.datetimeClosingVoting.toISOString(),
        title: values.title,
        type: values.type,
        prompt: values.prompt,
        address: values.contractAddress,
        votingMerkleRoot: values.votingMerkleRoot,
        submissionMerkleRoot: values.submissionMerkleRoot,
        author_address: values?.authorAddress ?? address,
        network_name: values.networkName,
        featured: values.featured ?? false,
        voting_requirements: values.voting_requirements,
        cost_to_propose: values.cost_to_propose,
        cost_to_vote: values.cost_to_vote,
        percentage_to_creator: values.percentage_to_creator,
      },
    ]);
    if (error) {
      throw new Error(error.message);
    }
  } catch (e) {
    throw e;
  }
}
