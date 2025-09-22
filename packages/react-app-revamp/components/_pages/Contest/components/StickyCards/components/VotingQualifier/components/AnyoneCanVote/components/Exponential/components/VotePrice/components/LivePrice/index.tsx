import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { motion } from "motion/react";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/react/shallow";

const VotingQualifierAnyoneCanVoteExponentialLivePrice: FC = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { contestInfoData, contestAbi, votingClose } = useContestStore(
    useShallow(state => ({
      contestInfoData: state.contestInfoData,
      contestAbi: state.contestAbi,
      votingClose: state.votesClose,
    })),
  );

  const { currentPricePerVoteFormatted, isLoading, isRefetching, isError, hasPriceChanged, isPreloading } =
    useCurrentPricePerVoteWithRefetch({
      address: contestInfoData.contestAddress,
      abi: contestAbi,
      chainId: contestInfoData.contestChainId,
      votingClose,
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
      {currentPricePerVoteFormatted}
      <span className="text-[16px] md:text-[24px] text-neutral-9 uppercase">
        {contestInfoData.contestChainNativeCurrencySymbol}
      </span>{" "}
      {isMobile && <span className="text-[12px] text-neutral-11">/ vote</span>}
    </motion.p>
  );
};

export default VotingQualifierAnyoneCanVoteExponentialLivePrice;
