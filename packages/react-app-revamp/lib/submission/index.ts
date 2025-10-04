import { serverConfig } from "@config/wagmi/server";
import { readContract, readContracts } from "@wagmi/core";
import { Abi } from "viem";
import { getProposalIdsRaw } from "@hooks/useProposal/utils";
import { formatEther } from "viem";
import { compareVersions } from "compare-versions";

/**
 * Static proposal data that doesn't change after creation
 */
export interface ProposalStaticData {
  description: string;
  author: string;
  exists: boolean;
  fieldsMetadata: {
    addressArray: string[];
    stringArray: string[];
    uintArray: bigint[];
  };
  isDeleted: boolean;
}

/**
 * Contest vote timing data (static)
 */
export interface ContestVoteTimings {
  voteStart: bigint;
  contestDeadline: bigint;
}

const defaultMetadataFields = {
  addressArray: [],
  stringArray: [],
  uintArray: [],
};

/**
 * Fetch static proposal data server-side
 * Only includes data that doesn't change (no votes, no voters, no comments)
 */
export const fetchProposalStaticData = async (
  address: string,
  proposalId: string,
  chainId: number,
  abi: Abi,
): Promise<ProposalStaticData | null> => {
  try {
    const contracts = [
      {
        address: address as `0x${string}`,
        abi,
        chainId,
        functionName: "getProposal",
        args: [proposalId],
      },
      {
        address: address as `0x${string}`,
        abi,
        chainId,
        functionName: "proposalIsDeleted",
        args: [proposalId],
      },
    ];

    const results = (await readContracts(serverConfig, { contracts })) as any;

    if (!results[0]?.result) {
      return null;
    }

    const proposalData = results[0].result;
    const isDeleted = results[1]?.result ?? false;

    const fieldsMetadata = proposalData.fieldsMetadata
      ? {
          addressArray: proposalData.fieldsMetadata.addressArray ?? defaultMetadataFields.addressArray,
          stringArray: proposalData.fieldsMetadata.stringArray ?? defaultMetadataFields.stringArray,
          uintArray: proposalData.fieldsMetadata.uintArray ?? defaultMetadataFields.uintArray,
        }
      : defaultMetadataFields;

    return {
      description: proposalData.description,
      author: proposalData.author,
      exists: proposalData.exists,
      fieldsMetadata,
      isDeleted,
    };
  } catch (error) {
    console.error("Error fetching proposal static data:", error);
    return null;
  }
};

export const fetchContestDetails = async (
  address: string,
  chainId: number,
  abi: Abi,
): Promise<{ author: string; name: string } | null> => {
  try {
    const results = await readContracts(serverConfig, {
      contracts: [
        {
          address: address as `0x${string}`,
          abi,
          chainId,
          functionName: "creator",
        },
        {
          address: address as `0x${string}`,
          abi,
          chainId,
          functionName: "name",
        },
      ],
    });

    return {
      author: results[0].result as string,
      name: results[1].result as string,
    };
  } catch (error) {
    console.error("Error fetching contest author:", error);
    return null;
  }
};

/**
 * Fetch contest vote timings (static data)
 */
export const fetchContestVoteTimings = async (
  address: string,
  chainId: number,
  abi: Abi,
): Promise<ContestVoteTimings | null> => {
  try {
    const results = await readContracts(serverConfig, {
      contracts: [
        {
          address: address as `0x${string}`,
          abi,
          chainId,
          functionName: "voteStart",
        },
        {
          address: address as `0x${string}`,
          abi,
          chainId,
          functionName: "contestDeadline",
        },
      ],
    });

    return {
      voteStart: results[0].result as bigint,
      contestDeadline: results[1].result as bigint,
    };
  } catch (error) {
    console.error("Error fetching contest vote timings:", error);
    return null;
  }
};

/**
 * Fetch all proposal IDs for navigation, sorted by votes (highest first)
 * Uses the existing getProposalIdsRaw utility from useProposal
 */
export const fetchAllProposalIds = async (
  address: string,
  chainId: number,
  abi: Abi,
  version: string,
): Promise<string[]> => {
  try {
    const isLegacy = !version || version.startsWith("3.");
    const hasDownvotes = version ? compareVersions(version, "5.1") < 0 : false;

    const contractConfig = {
      address: address as `0x${string}`,
      abi,
      chainId,
    };

    const proposalsIdsRawData = await getProposalIdsRaw(contractConfig, isLegacy, version);

    // For legacy, just return the IDs as-is
    if (isLegacy) {
      return (proposalsIdsRawData as bigint[]).map(id => id.toString());
    }

    // For non-legacy, we get [proposalIds, voteCounts]
    const proposalIds = proposalsIdsRawData[0] as bigint[];
    const voteCounts = proposalsIdsRawData[1];

    // Extract votes and map to objects for sorting
    const extractVotes = (index: number): number => {
      if (hasDownvotes) {
        const forVotes = BigInt(voteCounts[index].forVotes);
        const againstVotes = BigInt(voteCounts[index].againstVotes);
        return Number(formatEther(forVotes - againstVotes));
      }
      return Number(formatEther(voteCounts[index]));
    };

    const mappedProposals = proposalIds.map((id, index) => ({
      id: id.toString(),
      votes: extractVotes(index),
    }));

    // Sort by votes (highest first)
    const sortedProposals = mappedProposals.sort((a, b) => b.votes - a.votes);

    return sortedProposals.map(p => p.id);
  } catch (error) {
    console.error("Error fetching proposal IDs:", error);
    return [];
  }
};
