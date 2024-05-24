import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import usePaidRewardTokens from "@hooks/useRewardsTokens/usePaidRewardsTokens";
import useUnpaidRewardTokens from "@hooks/useRewardsTokens/useUnpaidRewardsTokens";
import { readContract } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { Abi, erc20Abi } from "viem";
import { useReadContract } from "wagmi";

interface ContestRewardsInfoProps {
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
}

const ContestRewardsInfo: FC<ContestRewardsInfoProps> = ({ rewardsModuleAddress, rewardsAbi }) => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const nativeCurrency = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.nativeCurrency.symbol;
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const {
    unpaidTokens,
    isLoading: isUnpaidTokensLoading,
    isError: isUnpaidTokensError,
    refetchUnpaidTokens,
  } = useUnpaidRewardTokens("rewards-info-unpaid-tokens", rewardsModuleAddress, true);
  const {
    paidTokens,
    isLoading: isPaidTokensLoading,
    isError: isPaidTokensError,
    refetchPaidTokens,
  } = usePaidRewardTokens("rewards-info-paid-tokens", rewardsModuleAddress, true);

  const {
    data: payees,
    isLoading: isPayeesDataLoading,
    isError: isPayeesDataError,
    refetch: refetchPayees,
  } = useReadContract({
    address: rewardsModuleAddress as `0x${string}`,
    abi: rewardsAbi,
    chainId: chainId,
    functionName: "getPayees",
  }) as { data: bigint[]; isLoading: boolean; isError: boolean; refetch: () => void };

  const [tokenSymbols, setTokenSymbols] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentToken = unpaidTokens ? unpaidTokens[currentIndex] : null;
  const currentSymbol = tokenSymbols[currentIndex];
  const isLoading = isUnpaidTokensLoading || isPaidTokensLoading || isPayeesDataLoading;
  const isError = isUnpaidTokensError || isPaidTokensError || isPayeesDataError;

  useEffect(() => {
    const fetchTokenSymbols = async () => {
      if (!unpaidTokens || isUnpaidTokensLoading) return;

      const symbols = await Promise.all(
        unpaidTokens.map(async token => {
          if (token.contractAddress === "native") {
            return nativeCurrency;
          } else {
            const symbol = readContract(config, {
              address: token.contractAddress as `0x${string}`,
              chainId: chainId,
              abi: erc20Abi,
              functionName: "symbol",
            });
            return symbol;
          }
        }),
      );
      setTokenSymbols(symbols);
    };

    fetchTokenSymbols();
  }, [unpaidTokens, isUnpaidTokensLoading, nativeCurrency, chainId]);

  useEffect(() => {
    if (unpaidTokens && unpaidTokens.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % unpaidTokens.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [unpaidTokens]);

  const determineErrorFunction = () => {
    if (isUnpaidTokensError) {
      return refetchUnpaidTokens;
    }

    if (isPaidTokensError) {
      return refetchPaidTokens;
    }

    if (isPayeesDataError) {
      return refetchPayees;
    }
  };

  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#000000" highlightColor="#212121" duration={1}>
        <Skeleton
          borderRadius={10}
          className="h-8 shrink-0 p-2 border border-neutral-11"
          width={isMobile ? 100 : 200}
        />
      </SkeletonTheme>
    );
  }

  if (isError) {
    return (
      <p className="text-[16px] text-negative-11 font-bold normal-case">
        there was an issue while loading rewards,{" "}
        <span className="underline" onClick={determineErrorFunction}>
          please try again
        </span>
      </p>
    );
  }

  if (unpaidTokens?.length === 0 && paidTokens && paidTokens?.length > 0) {
    return (
      <div className="flex shrink-0 h-8 p-4 items-center bg-neutral-0 border border-positive-11 rounded-[10px] text-[16px] font-bold text-positive-11">
        rewards paid out!
      </div>
    );
  }

  return (
    <>
      {currentToken ? (
        <div className="flex shrink-0 h-8 w-52 max-w-56 p-4 justify-center items-center bg-neutral-0 border border-transparent rounded-[10px] text-[16px] font-bold text-neutral-11 overflow-hidden">
          <span className="truncate flex items-center">
            {currentToken.tokenBalance} $
            <span className="uppercase mr-1 truncate inline-block overflow-hidden">{currentSymbol}</span>
            {!isMobile ? (
              <>
                to {payees.length} {payees.length > 1 ? "winners" : "winner"}
              </>
            ) : null}
          </span>
        </div>
      ) : null}
    </>
  );
};

export default ContestRewardsInfo;
