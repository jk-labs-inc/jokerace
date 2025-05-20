import GradientText from "@components/UI/GradientText";
import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { formatBalance } from "@helpers/formatBalance";
import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { useCancelRewards } from "@hooks/useCancelRewards";
import { useReleasableRewards } from "@hooks/useReleasableRewards";
import { useReleasedRewards } from "@hooks/useReleasedRewards";
import { usePathname } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { Abi, formatUnits } from "viem";
import { useReadContract } from "wagmi";

interface ContestRewardsInfoProps {
  rewardsModuleAddress: string;
  rewardsAbi: Abi;
  version: string;
}

const ContestRewardsInfo: FC<ContestRewardsInfoProps> = ({ rewardsModuleAddress, rewardsAbi, version }) => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const isMobile = useMediaQuery({ maxWidth: 768 });
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const isLoading = isReleasableLoading || isReleasedLoading;
  const isError = isReleasableError || isReleasedError;

  const flattenedRewards = useMemo(() => {
    const released =
      releasedRewards?.flatMap(reward =>
        reward.tokens.map(token => ({ ...token, isReleased: true, ranking: reward.ranking })),
      ) || [];
    const releasable =
      releasableRewards?.flatMap(reward =>
        reward.tokens.map(token => ({ ...token, isReleased: false, ranking: reward.ranking })),
      ) || [];
    return [...released, ...releasable];
  }, [releasedRewards, releasableRewards]);

  const currentReward = flattenedRewards[currentIndex];

  useEffect(() => {
    if (flattenedRewards.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % flattenedRewards.length;
          setAnimate(true);
          setTimeout(() => setAnimate(false), 500);
          return nextIndex;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else if (flattenedRewards.length === 1) {
      setCurrentIndex(0);
    }
  }, [flattenedRewards]);

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

  if (!currentReward || isError || isCanceled) return null;

  return (
    <>
      <div className="h-4 w-[2px] bg-primary-2"></div>
      <div className="flex items-baseline">
        <div className={`flex items-baseline gap-1 ${animate ? "animate-flicker-number" : ""}`}>
          <GradientText
            gradientClassName="bg-gradient-create"
            textSizeClassName="text-[14px] md:text-[24px] font-bold"
            isFontSabo={false}
          >
            {formatBalance(formatUnits(currentReward.amount ?? 0n, currentReward.decimals ?? 18))}{" "}
            <span className="uppercase text-[12px] md:text-[16px] font-bold">${currentReward.symbol}</span>
          </GradientText>
        </div>
        <span className="text-[12px] md:text-[16px] font-bold text-neutral-11 ml-1">
          {currentReward.isReleased ? "paid to" : "to"} {currentReward.ranking}
          <sup>{returnOnlySuffix(currentReward.ranking)}</sup>
        </span>
        <span className="text-[12px] md:text-[16px] font-bold text-neutral-11 ml-1">place</span>
      </div>
    </>
  );
};

export default ContestRewardsInfo;
