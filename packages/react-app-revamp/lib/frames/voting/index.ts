import { serverConfig } from "@config/wagmi/server";
import { MappedProposalIds } from "@hooks/useProposal/store";
import { getProposalIdsRaw } from "@hooks/useProposal/utils";
import { readContract, readContracts } from "@wagmi/core";
import { Abi, formatEther } from "viem";

interface RankDictionary {
  [key: string]: number;
}

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

export const fetchCostToVote = async (abi: Abi, chainId: number, address: string, amountOfVotesToCast: number) => {
  const costToVote = (await readContract(serverConfig, {
    address: address as `0x${string}`,
    abi,
    chainId,
    functionName: "costToVote",
  })) as bigint;

  const totalCost = BigInt(amountOfVotesToCast) * BigInt(costToVote);

  return totalCost;
};

export const fetchProposalInfo = async (abi: Abi, address: string, chainId: number, submission: string) => {
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

  const results = (await readContracts(serverConfig, { contracts })) as any;
  const data = results[0].result;
  const forVotesBigInt = results[1].result[0] as bigint;
  const againstVotesBigInt = results[1].result[1] as bigint;
  const votes = extractVotes(forVotesBigInt, againstVotesBigInt);
  const isDeleted = results[2].result;
  const content = isDeleted ? "This proposal has been deleted by the creator" : data.description;

  let rankInfo = { rank: 0, isTied: false };

  if (votes !== 0) {
    const proposalsIdsRawData = await getProposalIdsRaw(
      {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId,
      },
      false,
    );

    const mappedProposals = proposalsIdsRawData[0].map((idData: any, index: number) => ({
      votes: extractVotes(proposalsIdsRawData[1][index].forVotes, proposalsIdsRawData[1][index].againstVotes),
      id: idData.toString(),
    })) as MappedProposalIds[];

    rankInfo = assignRankAndCheckTies(mappedProposals, submission);
  }

  return {
    id: submission,
    authorEthereumAddress: data.author,
    content: content,
    exists: data.exists,
    votes,
    ...rankInfo,
  };
};
