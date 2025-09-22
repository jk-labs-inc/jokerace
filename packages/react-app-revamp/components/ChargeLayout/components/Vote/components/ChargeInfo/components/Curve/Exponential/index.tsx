import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import Skeleton from "react-loading-skeleton";
import { useShallow } from "zustand/react/shallow";

const ChargeInfoExponential = () => {
  const { contestInfo, contestAbi, votingClose } = useContestStore(
    useShallow(state => ({
      contestInfo: state.contestInfoData,
      contestAbi: state.contestAbi,
      votingClose: state.votesClose,
    })),
  );

  const { currentPricePerVoteFormatted, isLoading, isRefetching, isError, hasPriceChanged, isPreloading, refetch } =
    useCurrentPricePerVoteWithRefetch({
      address: contestInfo.contestAddress,
      abi: contestAbi,
      chainId: contestInfo.contestChainId,
      votingClose,
    });

  if (isError) {
    return <VotingQualifierError onClick={() => refetch()} />;
  }

  if (isLoading || isRefetching || isPreloading) {
    return <Skeleton width={100} height={24} baseColor="#6A6A6A" highlightColor="#BB65FF" />;
  }

  return (
    <p>
      {/* TODO: figure out how we wanna style the timer for the price per vote */}
      {currentPricePerVoteFormatted} {contestInfo.contestChainNativeCurrencySymbol}
    </p>
  );
};

export default ChargeInfoExponential;
