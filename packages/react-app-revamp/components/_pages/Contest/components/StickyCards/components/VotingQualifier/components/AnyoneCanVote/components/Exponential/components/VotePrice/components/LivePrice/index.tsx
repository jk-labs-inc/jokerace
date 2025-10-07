import AnimatedBlinkText from "@components/UI/AnimatedBlinkText";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/shallow";

const VotingQualifierAnyoneCanVoteExponentialLivePrice = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { votingClose } = useContestStore(
    useShallow(state => ({
      votingClose: state.votesClose,
    })),
  );
  const { currentPricePerVoteFormatted, isError } = useCurrentPricePerVoteWithRefetch({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose,
  });

  if (isError) {
    return <div className="text-red-500">Failed to load price</div>;
  }

  return (
    <p className="text-[16px] md:text-[24px] font-bold">
      <AnimatedBlinkText
        value={currentPricePerVoteFormatted}
        className="text-neutral-11"
        blinkColor="#78FFC6"
        duration={0.6}
      >
        {currentPricePerVoteFormatted}
      </AnimatedBlinkText>
      <span className="text-[16px] md:text-[24px] text-neutral-9 uppercase">
        {contestConfig.chainNativeCurrencySymbol}
      </span>{" "}
      {isMobile && <span className="text-[12px] text-neutral-11">/ vote</span>}
    </p>
  );
};

export default VotingQualifierAnyoneCanVoteExponentialLivePrice;
