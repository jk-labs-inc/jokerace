import { getTotalCharge } from "@helpers/totalCharge";
import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

interface TotalChargeProps {
  costToVote: number;
  amountOfVotes: number;
}

const TotalCharge: React.FC<TotalChargeProps> = ({ costToVote, amountOfVotes }) => {
  const [totalCharge, setTotalCharge] = useState("0");
  const { contestInfo, contestAbi, votingClose } = useContestStore(
    useShallow(state => ({
      contestInfo: state.contestInfoData,
      contestAbi: state.contestAbi,
      votingClose: state.votesClose,
    })),
  );
  const { currentPricePerVote, isLoading, isRefetching, isError, hasPriceChanged } = useCurrentPricePerVoteWithRefetch({
    address: contestInfo.contestAddress,
    abi: contestAbi,
    chainId: contestInfo.contestChainId,
    votingClose,
  });

  useEffect(() => {
    if (isNaN(amountOfVotes)) {
      setTotalCharge("0");
      return;
    }

    if (costToVote === 0) {
      setTotalCharge("0");
      return;
    }

    setTotalCharge(getTotalCharge(amountOfVotes, currentPricePerVote));
  }, [costToVote, amountOfVotes]);

  return (
    <div className="flex items-center justify-between text-neutral-11 text-[16px]">
      <p>total charge:</p>
      <p className="text-[24px] font-bold">
        {totalCharge} {contestInfo.contestChainNativeCurrencySymbol}
      </p>
    </div>
  );
};

export default TotalCharge;
