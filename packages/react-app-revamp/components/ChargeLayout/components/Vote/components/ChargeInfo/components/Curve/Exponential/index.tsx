import AnimatedBlinkText from "@components/UI/AnimatedBlinkText";
import VotingQualifierError from "@components/_pages/Contest/components/StickyCards/components/VotingQualifier/shared/Error";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useContestDeadline } from "@hooks/useContestTimings";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
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

  const { currentPricePerVoteFormatted, isError, refetch } = useCurrentPricePerVoteWithRefetch({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose: votingClose ?? new Date(),
    enabled: !isLoadingVotingClose && !isErrorVotingClose,
  });

  if (isError || isErrorVotingClose) {
    return <VotingQualifierError onClick={() => refetch()} />;
  }

  return (
    <AnimatedBlinkText value={currentPricePerVoteFormatted} blinkColor="#78FFC6">
      {currentPricePerVoteFormatted} {contestConfig.chainNativeCurrencySymbol}
    </AnimatedBlinkText>
  );
};

export default ChargeInfoExponential;
