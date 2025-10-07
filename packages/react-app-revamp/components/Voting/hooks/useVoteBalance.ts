import useContestConfigStore from "@hooks/useContestConfig/store";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useShallow } from "zustand/shallow";

interface UseVoteBalanceReturn {
  balance: any;
  insufficientBalance: boolean;
  isCorrectNetwork: boolean;
  contestChainId: number;
  userChainId: number | undefined;
  userAddress: string;
  chainNativeCurrencySymbol: string;
  isBalanceLoading: boolean;
  isBalanceError: boolean;
}

export const useVoteBalance = (costToVote: number): UseVoteBalanceReturn => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const contestChainId = contestConfig.chainId;
  const { chainId: userChainId, address: userAddress = "" } = useAccount();
  const {
    data: balance,
    isLoading,
    isError,
  } = useBalance({
    address: userAddress as `0x${string}`,
    chainId: contestChainId,
  });

  const insufficientBalance =
    !isLoading && !isError && balance ? Number(formatEther(balance.value)) < costToVote : false;
  const isCorrectNetwork = userChainId === contestChainId;

  return {
    balance,
    insufficientBalance,
    isCorrectNetwork,
    contestChainId,
    userChainId,
    userAddress,
    chainNativeCurrencySymbol: contestConfig.chainNativeCurrencySymbol,
    isBalanceLoading: isLoading,
    isBalanceError: isError,
  };
};
