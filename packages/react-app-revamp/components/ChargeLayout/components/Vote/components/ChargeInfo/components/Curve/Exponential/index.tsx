import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { useContestStore } from "@hooks/useContest/store";
import { useShallow } from "zustand/react/shallow";

const ChargeInfoExponential = () => {
  const { contestInfo, contestAbi, version, votingClose } = useContestStore(
    useShallow(state => ({
      contestInfo: state.contestInfoData,
      contestAbi: state.contestAbi,
      version: state.version,
      votingClose: state.votesClose,
    })),
  );

  const { currentPricePerVote, isLoading, isRefetching, isError, hasPriceChanged } = useCurrentPricePerVoteWithRefetch({
    address: contestInfo.contestAddress,
    abi: contestAbi,
    chainId: contestInfo.contestChainId,
    version,
    votingClose,
    //TODO: add fn to fetch interval
    priceCurveUpdateInterval: 60,
  });
  return (
    <div>
      <p>
        {currentPricePerVote} {contestInfo.contestChainNativeCurrencySymbol}
      </p>
    </div>
  );
};

export default ChargeInfoExponential;
