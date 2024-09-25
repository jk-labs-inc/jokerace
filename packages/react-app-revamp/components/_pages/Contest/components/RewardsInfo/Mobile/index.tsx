import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import { useCancelRewards } from "@hooks/useCancelRewards";
import { transform } from "@hooks/useDistributeRewards";
import { useReleasableRewards } from "@hooks/useReleasableRewards";
import { useReleasedRewards } from "@hooks/useReleasedRewards";
import { usePathname } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Abi } from "viem";
import { useReadContract } from "wagmi";

interface ContestRewardsInfoMobileProps {
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
  version: string;
}

const ContestRewardsInfoMobile: FC<ContestRewardsInfoMobileProps> = ({ rewardsModuleAddress, rewardsAbi, version }) => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;

  const { data: payees } = useReadContract({
    address: rewardsModuleAddress as `0x${string}`,
    chainId,
    abi: rewardsAbi,
    functionName: "getPayees",
    query: {
      select: (data: unknown) => {
        return (data as bigint[]).map((payee: bigint) => Number(payee));
      },
    },
  });

  const { isCanceled } = useCancelRewards({
    rewardsAddress: rewardsModuleAddress as `0x${string}`,
    chainId,
    abi: rewardsAbi,
    version,
  });

  const {
    data: releasableRewards,
    isLoading: isReleasableLoading,
    isContractError: isReleasableError,
  } = useReleasableRewards({ contractAddress: rewardsModuleAddress, chainId, abi: rewardsAbi, rankings: payees ?? [] });

  const {
    data: releasedRewards,
    isLoading: isReleasedLoading,
    isContractError: isReleasedError,
  } = useReleasedRewards({ contractAddress: rewardsModuleAddress, chainId, abi: rewardsAbi, rankings: payees ?? [] });

  const totalRewards = useMemo(() => {
    const allRewards = [...(releasedRewards || []), ...(releasableRewards || [])];
    const totals: { [key: string]: bigint } = {};

    allRewards.forEach(reward => {
      reward.tokens.forEach(token => {
        if (!totals[token.symbol]) {
          totals[token.symbol] = 0n;
        }
        totals[token.symbol] += token.amount ?? 0n;
      });
    });

    return Object.entries(totals).map(([symbol, amount]) => ({
      symbol,
      amount,
      address:
        allRewards.find(r => r.tokens.some(t => t.symbol === symbol))?.tokens.find(t => t.symbol === symbol)?.address ||
        "",
      decimals:
        allRewards.find(r => r.tokens.some(t => t.symbol === symbol))?.tokens.find(t => t.symbol === symbol)
          ?.decimals || 18,
    }));
  }, [releasedRewards, releasableRewards]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const isLoading = isReleasableLoading || isReleasedLoading;
  const isError = isReleasableError || isReleasedError;

  useEffect(() => {
    if (totalRewards.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % totalRewards.length;
          setAnimate(true);
          setTimeout(() => setAnimate(false), 1000);
          return nextIndex;
        });
      }, 1500);

      return () => clearInterval(interval);
    } else if (totalRewards.length === 1) {
      setCurrentIndex(0);
    }
  }, [totalRewards]);

  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#000000" highlightColor="#212121" duration={1}>
        <Skeleton borderRadius={10} className="h-8 shrink-0 p-2 border border-neutral-11" width={100} />
      </SkeletonTheme>
    );
  }

  if (totalRewards.length === 0 || isError || isCanceled) return null;

  const currentReward = totalRewards[currentIndex];
  const currentRewardAmount = transform(currentReward.amount, currentReward.address, currentReward.decimals).toString();

  return (
    <div
      className={`flex shrink-0 h-8 p-2 justify-center items-center bg-transparent border border-neutral-10 rounded-[10px] text-[16px] font-bold text-positive-11 overflow-hidden`}
    >
      <span className="truncate flex items-center">
        <div className={`flex items-center ${animate ? "animate-reveal" : ""}`}>
          {formatBalance(currentRewardAmount)} $
          <span className="uppercase mr-1 truncate inline-block overflow-hidden">{currentReward.symbol}</span>
        </div>
      </span>
    </div>
  );
};

export default ContestRewardsInfoMobile;
