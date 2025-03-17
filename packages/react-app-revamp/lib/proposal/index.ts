import { Proposal } from "@components/_pages/ProposalContent";
import { config } from "@config/wagmi";
import { isContentTweet } from "@helpers/isContentTweet";
import isUrlToImage from "@helpers/isUrlToImage";
import { MappedProposalIds } from "@hooks/useProposal/store";
import { getProposalIdsRaw, RawMetadataFields } from "@hooks/useProposal/utils";
import { readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { formatEther } from "viem";

interface RankDictionary {
  [key: string]: number;
}

export interface ProposalData {
  proposal: Proposal | null;
  numberOfComments: number | null;
  votedAddresses: string[] | null;
}

export enum ProposalState {
  Deleted = "This entry has been deleted by the creator.",
}

export const COMMENTS_VERSION = "4.13";

const defaultMetadataFields: RawMetadataFields = {
  addressArray: [],
  stringArray: [],
  uintArray: [],
};

const extractVotes = (forVotesValue: bigint, againstVotesValue: bigint) => {
  const netVotes = Number(formatEther(forVotesValue - againstVotesValue));

  return netVotes;
};

const assignRankAndCheckTies = (mappedProposals: MappedProposalIds[], targetId: string) => {
  const sortedProposals = [...mappedProposals].sort((a, b) => b.votes - a.votes);

  let currentRank = 0;
  let lastVotes: number | null = null;
  const ranks: RankDictionary = {};

  sortedProposals.forEach(proposal => {
    if (proposal.votes !== lastVotes) {
      currentRank++;
      lastVotes = proposal.votes;
    }
    ranks[proposal.id] = proposal.votes > 0 ? currentRank : 0;
  });

  const rank = ranks[targetId];
  const isTied = Object.values(ranks).filter(targetRank => targetRank === rank).length > 1;

  return { rank, isTied };
};

const fetchProposalInfo = async (abi: any, version: string, address: string, chainId: number, submission: string) => {
  let contracts = [
    {
      address: address as `0x${string}`,
      abi,
      chainId,
      functionName: "getProposal",
      args: [submission],
    },
    {
      address: address as `0x${string}`,
      abi,
      chainId,
      functionName: "proposalVotes",
      args: [submission],
    },
    {
      address: address as `0x${string}`,
      abi,
      chainId,
      functionName: "proposalIsDeleted",
      args: [submission],
    },
  ];

  const results = (await readContracts(config, { contracts })) as any;
  const data = results[0].result;
  const isDeleted = results[2].result;
  const content = isDeleted ? ProposalState.Deleted : data.description;
  const { fieldsMetadata } = data;
  const metadataFields: RawMetadataFields = fieldsMetadata
    ? {
        addressArray: fieldsMetadata.addressArray ?? defaultMetadataFields.addressArray,
        stringArray: fieldsMetadata.stringArray ?? defaultMetadataFields.stringArray,
        uintArray: fieldsMetadata.uintArray ?? defaultMetadataFields.uintArray,
      }
    : defaultMetadataFields;

  // calculate votes based on version
  const hasDownvotes = compareVersions(version, "5.1") < 0;
  let votes: number;

  if (hasDownvotes) {
    // older version with for/against votes
    const forVotesBigInt = results[1].result[0] as bigint;
    const againstVotesBigInt = results[1].result[1] as bigint;
    votes = extractVotes(forVotesBigInt, againstVotesBigInt);
  } else {
    // newer version with single vote count
    const votesBigInt = results[1].result as bigint;
    votes = Number(formatEther(votesBigInt));
  }

  let rankInfo = { rank: 0, isTied: false };

  if (votes !== 0) {
    const proposalsIdsRawData = await getProposalIdsRaw(
      {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId,
      },
      false,
      version,
    );

    // handle different vote data structure based on version
    const mappedProposals = proposalsIdsRawData[0].map((idData: any, index: number) => {
      let proposalVotes: number;

      if (hasDownvotes) {
        proposalVotes = extractVotes(
          proposalsIdsRawData[1][index].forVotes,
          proposalsIdsRawData[1][index].againstVotes,
        );
      } else {
        proposalVotes = Number(formatEther(proposalsIdsRawData[1][index]));
      }

      return {
        votes: proposalVotes,
        id: idData.toString(),
      };
    }) as MappedProposalIds[];

    rankInfo = assignRankAndCheckTies(mappedProposals, submission);
  }

  return {
    id: submission,
    authorEthereumAddress: data.author,
    content: content,
    isContentImage: isUrlToImage(data.description),
    tweet: isContentTweet(data.description),
    metadataFields,
    exists: data.exists,
    votes,
    ...rankInfo,
  };
};

const fetchNumberOfComments = async (
  abi: any,
  version: string,
  address: string,
  chainId: number,
  submission: string,
): Promise<number | null> => {
  if (compareVersions(version, COMMENTS_VERSION) == -1) return 0;

  const contracts = [
    {
      address: address as `0x${string}`,
      abi,
      chainId,
      functionName: "getProposalComments",
      args: [submission],
    },
    {
      address: address as `0x${string}`,
      abi,
      chainId,
      functionName: "getAllDeletedCommentIds",
      args: [],
    },
  ];

  try {
    const results = (await readContracts(config, { contracts })) as any;
    const allCommentsIdsBigInt = results[0]?.result as bigint[];
    const deletedCommentIdsBigInt = results[1]?.result as bigint[];
    const deletedCommentIdsSet = new Set(deletedCommentIdsBigInt);

    return allCommentsIdsBigInt.filter(id => !deletedCommentIdsSet.has(id)).length;
  } catch {
    return null;
  }
};

const fetchAddressesVoted = async (
  abi: any,
  address: string,
  chainId: number,
  submission: string,
): Promise<string[] | null> => {
  try {
    const addresses = (await readContract(config, {
      address: address as `0x${string}`,
      abi: abi,
      chainId,
      functionName: "proposalAddressesHaveVoted",
      args: [submission],
    })) as string[];

    return addresses;
  } catch {
    return null;
  }
};

export const fetchProposalData = async (
  abi: any,
  version: string,
  address: string,
  chainId: number,
  submission: string,
): Promise<ProposalData | null> => {
  try {
    if (!abi || !version) return null;

    const results = await Promise.allSettled([
      fetchProposalInfo(abi, version, address, chainId, submission),
      fetchNumberOfComments(abi, version, address, chainId, submission),
      fetchAddressesVoted(abi, address, chainId, submission),
    ]);

    const proposalInfo = results[0].status === "fulfilled" ? results[0].value : null;
    const numberOfComments = results[1].status === "fulfilled" ? results[1].value : null;
    const votedAddresses = results[2].status === "fulfilled" ? results[2].value : null;

    return {
      proposal: proposalInfo
        ? {
            ...proposalInfo,
            commentsCount: numberOfComments ?? 0,
          }
        : null,
      numberOfComments,
      votedAddresses,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
