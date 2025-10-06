import { getTotalCharge } from "@helpers/totalCharge";
import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

interface TotalChargeProps {
  costToVote: bigint;
  amountOfVotes: number;
}

const TotalCharge: React.FC<TotalChargeProps> = ({ costToVote, amountOfVotes }) => {
  const [totalCharge, setTotalCharge] = useState("0");
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  //TODO: we need to pass this info instead of getting it from the store
  // const { votingClose } = useContestStore(
  //   useShallow(state => ({
  //     votingClose: state.votesClose,
  //   })),
  // );
  const { currentPricePerVote, isLoading, isRefetching, isError, hasPriceChanged } = useCurrentPricePerVoteWithRefetch({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose: new Date(),
  });

  useEffect(() => {
    if (isNaN(amountOfVotes)) {
      setTotalCharge("0");
      return;
    }

    if (costToVote === 0n) {
      setTotalCharge("0");
      return;
    }

    setTotalCharge(getTotalCharge(amountOfVotes, currentPricePerVote));
  }, [costToVote, amountOfVotes]);

  return (
    <div className="flex items-center justify-between text-neutral-11 text-[16px]">
      <p>total charge:</p>
      <p className="text-[24px] font-bold">
        {totalCharge} {contestConfig.chainNativeCurrencySymbol}
      </p>
    </div>
  );
};

export default TotalCharge;
