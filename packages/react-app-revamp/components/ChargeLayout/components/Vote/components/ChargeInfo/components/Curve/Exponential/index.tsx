import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { useContestStore } from "@hooks/useContest/store";
import Skeleton from "react-loading-skeleton";
import { useShallow } from "zustand/react/shallow";
import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";

const ChargeInfoExponential = () => {
  const { contestInfo, contestAbi, version, votingClose } = useContestStore(
    useShallow(state => ({
      contestInfo: state.contestInfoData,
      contestAbi: state.contestAbi,
      version: state.version,
      votingClose: state.votesClose,
    })),
  );

  const { currentPricePerVote, isLoading, isRefetching, isError, hasPriceChanged, isPreloading, refetch } =
    useCurrentPricePerVoteWithRefetch({
      address: contestInfo.contestAddress,
      abi: contestAbi,
      chainId: contestInfo.contestChainId,
      version,
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
      {currentPricePerVote} {contestInfo.contestChainNativeCurrencySymbol}
    </p>
  );
};

export default ChargeInfoExponential;
