import { Abi } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

interface ContestTimingsParams {
  contestAddress: `0x${string}`;
  contestChainId: number;
  contestAbi: Abi;
}

interface ContestTimingsResult {
  contestStart: Date | undefined;
  contestDeadline: Date | undefined;
  voteStart: Date | undefined;
  isLoading: boolean;
  isError: boolean;
}

interface SingleTimingResult {
  value: Date | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const useContestTimings = ({
  contestAddress,
  contestChainId,
  contestAbi,
}: ContestTimingsParams): ContestTimingsResult => {
  const {
    data: contestTimings,
    isLoading,
    isError,
  } = useReadContracts({
    contracts: [
      {
        address: contestAddress,
        chainId: contestChainId,
        abi: contestAbi,
        functionName: "contestStart",
      },
      {
        address: contestAddress,
        chainId: contestChainId,
        abi: contestAbi,
        functionName: "contestDeadline",
      },
      {
        address: contestAddress,
        chainId: contestChainId,
        abi: contestAbi,
        functionName: "voteStart",
      },
    ],
    query: {
      staleTime: Infinity,
      select: data => {
        return {
          contestStart: new Date(Number(data[0].result) * 1000 + 1000),
          contestDeadline: new Date(Number(data[1].result) * 1000 + 1000),
          voteStart: new Date(Number(data[2].result) * 1000 + 1000),
        };
      },
    },
  });

  return {
    contestStart: contestTimings?.contestStart,
    contestDeadline: contestTimings?.contestDeadline,
    voteStart: contestTimings?.voteStart,
    isLoading,
    isError,
  };
};

export const useContestStart = ({
  contestAddress,
  contestChainId,
  contestAbi,
}: ContestTimingsParams): SingleTimingResult => {
  const { data, isLoading, isError } = useReadContract({
    address: contestAddress,
    chainId: contestChainId,
    abi: contestAbi,
    functionName: "contestStart",
    query: {
      staleTime: Infinity,
      select: data => {
        return new Date(Number(data) * 1000 + 1000);
      },
    },
  });

  return {
    value: data,
    isLoading,
    isError,
  };
};

export const useContestDeadline = ({
  contestAddress,
  contestChainId,
  contestAbi,
}: ContestTimingsParams): SingleTimingResult => {
  const { data, isLoading, isError } = useReadContract({
    address: contestAddress,
    chainId: contestChainId,
    abi: contestAbi,
    functionName: "contestDeadline",
    query: {
      staleTime: Infinity,
      select: data => {
        return new Date(Number(data) * 1000 + 1000);
      },
    },
  });

  return {
    value: data,
    isLoading,
    isError,
  };
};

export const useVoteStart = ({
  contestAddress,
  contestChainId,
  contestAbi,
}: ContestTimingsParams): SingleTimingResult => {
  const { data, isLoading, isError } = useReadContract({
    address: contestAddress,
    chainId: contestChainId,
    abi: contestAbi,
    functionName: "voteStart",
    query: {
      staleTime: Infinity,
      select: data => {
        return new Date(Number(data) * 1000 + 1000);
      },
    },
  });

  return {
    value: data,
    isLoading,
    isError,
  };
};
