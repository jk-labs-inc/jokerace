import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import Skeleton from "react-loading-skeleton";
import { useShallow } from "zustand/shallow";

const ChargeInfoExponential = () => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  //TODO: we need to pass this info instead of getting it from the store
  // const { votingClose } = useContestStore(
  //   useShallow(state => ({
  //     votingClose: state.votesClose,
  //   })),
  // );

  const { currentPricePerVoteFormatted, isLoading, isRefetching, isError, hasPriceChanged, isPreloading, refetch } =
    useCurrentPricePerVoteWithRefetch({
      address: contestConfig.address,
      abi: contestConfig.abi,
      chainId: contestConfig.chainId,
      votingClose: new Date(),
    });

  if (isError) {
    return <VotingQualifierError onClick={() => refetch()} />;
  }

  if (isLoading || isRefetching || isPreloading) {
    return <Skeleton width={100} height={16} baseColor="#6A6A6A" highlightColor="#BB65FF" />;
  }

  return (
    <p>
      {currentPricePerVoteFormatted} {contestConfig.chainNativeCurrencySymbol}
    </p>
  );
};

export default ChargeInfoExponential;
