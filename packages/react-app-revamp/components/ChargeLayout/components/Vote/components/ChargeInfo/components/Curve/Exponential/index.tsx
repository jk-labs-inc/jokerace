import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useContestDeadline } from "@hooks/useContestTimings";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import Skeleton from "react-loading-skeleton";
import { useShallow } from "zustand/shallow";

const ChargeInfoExponential = () => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const {
    value: votingClose,
    isLoading: isLoadingVotingClose,
    isError: isErrorVotingClose,
  } = useContestDeadline({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
  });

  const { currentPricePerVoteFormatted, isLoading, isRefetching, isError, hasPriceChanged, isPreloading, refetch } =
    useCurrentPricePerVoteWithRefetch({
      address: contestConfig.address,
      abi: contestConfig.abi,
      chainId: contestConfig.chainId,
      votingClose: votingClose ?? new Date(),
      enabled: !isLoadingVotingClose && !isErrorVotingClose,
    });

  if (isError || isErrorVotingClose) {
    return <VotingQualifierError onClick={() => refetch()} />;
  }

  if (isLoading || isRefetching || isPreloading || isLoadingVotingClose) {
    return <Skeleton width={100} height={16} baseColor="#6A6A6A" highlightColor="#BB65FF" />;
  }

  return (
    <p>
      {currentPricePerVoteFormatted} {contestConfig.chainNativeCurrencySymbol}
    </p>
  );
};

export default ChargeInfoExponential;
