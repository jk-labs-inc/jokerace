import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { useShallow } from "zustand/react/shallow";
import { motion } from "motion/react";

interface VotingQualifierAnyoneCanVoteExponentialLivePriceProps {
  priceCurveUpdateInterval: number;
}

const VotingQualifierAnyoneCanVoteExponentialLivePrice: FC<VotingQualifierAnyoneCanVoteExponentialLivePriceProps> = ({
  priceCurveUpdateInterval,
}) => {
  const { contestInfoData, contestAbi, version, votingClose } = useContestStore(
    useShallow(state => ({
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
      version: state.version,
      votingClose: state.votesClose,
    })),
  );

  const { currentPricePerVote, isLoading, isRefetching, isError, hasPriceChanged, isPreloading } =
    useCurrentPricePerVoteWithRefetch({
      address: contestInfoData.contestAddress,
      abi: contestAbi,
      chainId: contestInfoData.contestChainId,
      version,
      votingClose,
      priceCurveUpdateInterval,
    });

  if (isError) {
    return <div className="text-red-500">Failed to load price</div>;
  }

  if (isLoading || isRefetching || isPreloading) {
    return <Skeleton width={100} height={24} baseColor="#6A6A6A" highlightColor="#BB65FF" />;
  }

  return (
    <motion.p
      className="text-[16px] md:text-[24px] text-neutral-11 font-bold"
      animate={{
        color: hasPriceChanged ? "#78FFC6" : "#E5E5E5",
      }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
      }}
    >
      {currentPricePerVote}{" "}
      <span className="text-[16px] text-neutral-9">{contestInfoData.contestChainNativeCurrencySymbol}</span>
    </motion.p>
  );
};

export default VotingQualifierAnyoneCanVoteExponentialLivePrice;
