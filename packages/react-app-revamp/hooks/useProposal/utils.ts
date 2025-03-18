import { serverConfig } from "@config/wagmi/server";
import { isContentTweet } from "@helpers/isContentTweet";
import isUrlToImage from "@helpers/isUrlToImage";
import { readContract, readContracts } from "@wagmi/core";
import { shuffle } from "lodash";
import { formatEther } from "viem";
import { MappedProposalIds, ProposalCore, SortOptions } from "./store";
import { ContractConfig } from "@hooks/useContest";

interface RankDictionary {
  [key: string]: number;
}

export interface RawMetadataFields {
  addressArray: string[];
  stringArray: string[];
  uintArray: bigint[];
}

const defaultMetadataFields: RawMetadataFields = {
  addressArray: [],
  stringArray: [],
  uintArray: [],
};

const checkForTiedRanks = (ranks: RankDictionary, currentRank: number): boolean => {
  let count = 0;
  Object.values(ranks).forEach(rank => {
    if (rank === currentRank) {
      count++;
    }
  });
  return count > 1;
};

export function mapResultToStringArray(result: any): string[] {
  if (Array.isArray(result)) {
    return result.map((id: bigint) => id.toString());
  } else {
    return [result.toString()];
  }
}

export function sortProposals(sortBy: SortOptions, listProposalsIds: MappedProposalIds[]): string[] {
  let sortedProposals;

  switch (sortBy) {
    case "mostRecent":
      sortedProposals = [...listProposalsIds].reverse();
      break;
    case "random":
      sortedProposals = shuffle([...listProposalsIds]);
      break;
    case "leastRecent":
      sortedProposals = [...listProposalsIds];
      break;
    case "votes":
      sortedProposals = [...listProposalsIds].sort((a, b) => b.votes - a.votes);
      break;
    default:
      sortedProposals = [...listProposalsIds];
  }

  return sortedProposals.map(proposal => proposal.id);
}

/**
 * Assign ranks to proposals based on their net votes, using a complete list of all proposals.
 * @param currentPageProposals - Proposals on the current page.
 * @param allProposalsIdsAndVotes - Array of all proposals with their IDs and votes.
 */
export function formatProposalData(
  currentPageProposals: ProposalCore[],
  allProposalsIdsAndVotes: MappedProposalIds[],
): ProposalCore[] {
  const sortedAllProposals = [...allProposalsIdsAndVotes].sort((a, b) => b.votes - a.votes);

  const ranks: RankDictionary = {};
  let currentRank = 0;
  let lastVotes: number | null = null;

  sortedAllProposals.forEach(proposal => {
    const votes = proposal.votes;
    if (votes !== lastVotes) {
      lastVotes = votes;
      if (votes > 0) {
        currentRank++;
      }
    }
    ranks[proposal.id] = votes > 0 ? currentRank : 0;
  });

  return currentPageProposals.map(proposal => {
    const proposalRank = ranks[proposal.id];
    const isTied = proposal.netVotes > 0 && checkForTiedRanks(ranks, proposalRank);

    return {
      ...proposal,
      rank: proposalRank,
      isTied: isTied,
    };
  });
}

/**
 * Assign ranks to a proposals on update based on their net votes, using a complete list of all proposals.
 * @param updatedProposals - Updated proposals ( either when user vote or delete it)
 * @param initialMappedProposalIds - Array of all proposals with their IDs and votes.
 */
export function updateAndRankProposals(
  updatedProposals: ProposalCore[],
  initialMappedProposalIds: MappedProposalIds[],
): [ProposalCore[], MappedProposalIds[]] {
  const sortedProposals = updatedProposals.sort((a, b) => b.netVotes - a.netVotes);

  const ranks: RankDictionary = {};
  let currentRank = 0;
  let lastVotes: number | null = null;

  sortedProposals.forEach(proposal => {
    if (proposal.netVotes !== lastVotes) {
      lastVotes = proposal.netVotes;
      currentRank = lastVotes > 0 ? currentRank + 1 : currentRank;
    }
    ranks[proposal.id] = proposal.netVotes > 0 ? currentRank : 0;
  });

  const proposalsWithRanks = sortedProposals.map(proposal => {
    const proposalRank = ranks[proposal.id];
    const isTied = proposal.netVotes > 0 && checkForTiedRanks(ranks, proposalRank);

    return {
      ...proposal,
      rank: proposalRank,
      isTied: isTied,
    };
  });

  // Update the initial proposal IDs map
  const updatedMappedProposalIds = initialMappedProposalIds.map(idMap => {
    const foundProposal = proposalsWithRanks.find(proposal => proposal.id === idMap.id);
    return foundProposal ? { ...idMap, votes: foundProposal.netVotes } : idMap;
  });

  return [proposalsWithRanks, updatedMappedProposalIds];
}

/**
 * Transforms a single proposal's data based on its ID and result data.
 * @param id - The ID of the proposal.
 * @param voteData - The voting data of the proposal.
 * @param proposalData - The detailed data of the proposal.
 * @returns An object representing the transformed proposal data.
 */
export function transformProposalData(
  id: any,
  voteData: any,
  proposalData: any,
  proposalCommentsIds: bigint[] = [],
  deletedCommentIds: bigint[] = [],
) {
  const voteForBigInt = BigInt(voteData.result[0]);
  const voteAgainstBigInt = BigInt(voteData.result[1]);
  const netVotes = Number(formatEther(voteForBigInt - voteAgainstBigInt));
  const isContentImage = isUrlToImage(proposalData.description);
  const tweet = isContentTweet(proposalData.description);
  const deletedCommentIdsSet = new Set(deletedCommentIds.map(id => id.toString()));
  const allCommentsIds = proposalCommentsIds.map(id => id.toString()).filter(id => !deletedCommentIdsSet.has(id));

  const { fieldsMetadata, ...restProposalData } = proposalData;
  const metadataFields: RawMetadataFields = fieldsMetadata
    ? {
        addressArray: fieldsMetadata.addressArray ?? defaultMetadataFields.addressArray,
        stringArray: fieldsMetadata.stringArray ?? defaultMetadataFields.stringArray,
        uintArray: fieldsMetadata.uintArray ?? defaultMetadataFields.uintArray,
      }
    : defaultMetadataFields;

  return {
    id: id.toString(),
    ...restProposalData,
    metadataFields,
    isContentImage,
    tweet,
    netVotes,
    commentsCount: allCommentsIds.length,
  };
}

/**
 * Gets the proposal ids from the contract.
 * @param contractConfig
 * @param isLegacy
 */
export async function getProposalIdsRaw(contractConfig: ContractConfig, isLegacy: boolean) {
  try {
    if (isLegacy) {
      const result = (await readContract(serverConfig, {
        ...contractConfig,
        functionName: "getAllProposalIds",
        args: [],
      })) as any;

      return result || [];
    } else {
      const contracts = [
        {
          ...contractConfig,
          functionName: "allProposalTotalVotes",
          args: [],
        },
        {
          ...contractConfig,
          functionName: "getAllDeletedProposalIds",
          args: [],
        },
      ];

      const results: any[] = await readContracts(serverConfig, { contracts });

      if (
        !results ||
        !results[0] ||
        !results[0].result ||
        !Array.isArray(results[0].result) ||
        results[0].result.length < 2
      ) {
        return [[], []];
      }

      const allProposals = results[0].result[0];

      // check if allProposals is valid
      if (!allProposals || !Array.isArray(allProposals)) {
        return [[], []];
      }

      const deletedIdsArray = results[1]?.result;

      if (!deletedIdsArray) {
        return [allProposals, results[0].result[1]];
      }

      const deletedProposalSet = new Set(mapResultToStringArray(deletedIdsArray));

      if (!results[0].result[1] || !Array.isArray(results[0].result[1])) {
        return [[], []];
      }

      const validData = allProposals.reduce(
        (
          accumulator: { validProposalIds: any[]; correspondingVotes: any[] },
          proposalId: { toString: () => string },
          index: string | number,
        ) => {
          if (!deletedProposalSet.has(proposalId.toString())) {
            accumulator.validProposalIds.push(proposalId);
            if (index < results[0].result[1].length) {
              accumulator.correspondingVotes.push(results[0].result[1][index]);
            } else {
              accumulator.correspondingVotes.push(null);
            }
          }
          return accumulator;
        },
        { validProposalIds: [], correspondingVotes: [] },
      );

      return [validData.validProposalIds, validData.correspondingVotes];
    }
  } catch (error) {
    console.error("Error fetching proposal IDs:", error);
    return [[], []];
  }
}
