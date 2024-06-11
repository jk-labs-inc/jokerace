import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import usePaidRewardTokens from "@hooks/useRewardsTokens/usePaidRewardsTokens";
import useUnpaidRewardTokens from "@hooks/useRewardsTokens/useUnpaidRewardsTokens";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { Abi } from "viem";
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

  const [currentUnpaidIndex, setCurrentUnpaidIndex] = useState(0);
  const [currentPaidIndex, setCurrentPaidIndex] = useState(0);
  const [animateUnpaid, setAnimateUnpaid] = useState(false);
  const [animatePaid, setAnimatePaid] = useState(false);
  const currentUnpaidToken = unpaidTokens ? unpaidTokens[currentUnpaidIndex] : null;
  const currentPaidToken = paidTokens ? paidTokens[currentPaidIndex] : null;
  const currentUnpaidSymbol = currentUnpaidToken?.tokenSymbol ?? null;
  const currentPaidSymbol = currentPaidToken?.tokenSymbol ?? null;
  const isLoading = isUnpaidTokensLoading || isPaidTokensLoading || isPayeesDataLoading;
  const isError = isUnpaidTokensError || isPaidTokensError || isPayeesDataError;

  useEffect(() => {
    if (unpaidTokens && unpaidTokens.length > 1) {
      const interval = setInterval(() => {
        setCurrentUnpaidIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % unpaidTokens.length;
          setAnimateUnpaid(true);
          setTimeout(() => setAnimateUnpaid(false), 1000);
          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(interval);
    } else if (unpaidTokens && unpaidTokens.length === 1) {
      setCurrentUnpaidIndex(0);
    }
  }, [unpaidTokens]);

  useEffect(() => {
    if (paidTokens && paidTokens.length > 1) {
      const interval = setInterval(() => {
        setCurrentPaidIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % paidTokens.length;
          setAnimatePaid(true);
          setTimeout(() => setAnimatePaid(false), 1000);
          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(interval);
    } else if (paidTokens && paidTokens.length === 1) {
      setCurrentPaidIndex(0);
    }
  }, [paidTokens]);

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

  if (!currentUnpaidToken && !currentPaidToken) return null;

  return (
    <>
      {currentUnpaidToken ? (
        <div className="flex shrink-0 h-8 min-w-52 p-4 justify-center items-center bg-neutral-0 border border-transparent rounded-[10px] text-[16px] font-bold text-neutral-11 overflow-hidden">
          <span className="truncate flex items-center">
            <div className={`flex items-center ${animateUnpaid ? "animate-reveal" : ""}`}>
              {formatBalance(currentUnpaidToken.tokenBalance)} $
              <span className="uppercase mr-1 truncate inline-block overflow-hidden">{currentUnpaidSymbol}</span>
            </div>

            {!isMobile ? (
              <>
                to {payees.length} {payees.length > 1 ? "winners" : "winner"}
              </>
            ) : null}
          </span>
        </div>
      ) : currentPaidToken ? (
        <div className="flex shrink-0 h-8 min-w-52 p-4 justify-center items-center bg-neutral-0 border border-positive-11 rounded-[10px] text-[16px] font-bold text-positive-11 overflow-hidden">
          <span className="truncate flex items-center">
            <div className={`flex items-center ${animatePaid ? "animate-reveal" : ""}`}>
              {formatBalance(currentPaidToken.tokenBalance)} $
              <span className="uppercase mr-1 truncate inline-block overflow-hidden">{currentPaidSymbol}</span>
            </div>
            paid out!
          </span>
        </div>
      ) : null}
    </>
  );
};

export default ContestRewardsInfo;
