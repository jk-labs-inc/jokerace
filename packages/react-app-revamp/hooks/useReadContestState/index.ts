import { ContestStateEnum } from "@hooks/useContestState/store";
import { Abi } from "viem";
import { useReadContract } from "wagmi";

interface ReadContestStateParams {
  contestAddress: `0x${string}`;
  contestChainId: number;
  contestAbi: Abi;
}

interface ReadContestStateResult {
  state: ContestStateEnum | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const useReadContestState = ({
  contestAddress,
  contestChainId,
  contestAbi,
}: ReadContestStateParams): ReadContestStateResult => {
  const { data, isLoading, isError } = useReadContract({
    address: contestAddress,
    chainId: contestChainId,
    abi: contestAbi,
    functionName: "state",
    query: {
      select: data => {
        return Number(data) as ContestStateEnum;
      },
    },
  });

  return {
    state: data,
    isLoading,
    isError,
  };
};
