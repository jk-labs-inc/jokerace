import { getTotalCharge } from "@helpers/totalCharge";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useContestDeadline } from "@hooks/useContestTimings";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

interface TotalChargeProps {
  amountOfVotes: number;
}

const TotalCharge: React.FC<TotalChargeProps> = ({ amountOfVotes }) => {
  const [totalCharge, setTotalCharge] = useState("0");
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const {
    value: votingClose,
    isLoading: isLoadingVotingClose,
    isError: isErrorVotingClose,
  } = useContestDeadline({
    contestAddress: contestConfig.address,
    contestChainId: contestConfig.chainId,
    contestAbi: contestConfig.abi,
  });
  const { currentPricePerVote } = useCurrentPricePerVoteWithRefetch({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose: votingClose ?? new Date(),
    enabled: !isLoadingVotingClose && !isErrorVotingClose,
  });

  useEffect(() => {
    if (isNaN(amountOfVotes)) {
      setTotalCharge("0");
      return;
    }

    if (Number(currentPricePerVote) === 0) {
      setTotalCharge("0");
      return;
    }

    setTotalCharge(getTotalCharge(amountOfVotes, currentPricePerVote));
  }, [amountOfVotes, currentPricePerVote]);

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
