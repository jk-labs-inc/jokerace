import { getTotalCharge } from "@helpers/totalCharge";
import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { Charge, VoteType } from "@hooks/useDeployContest/types";
import React, { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useShallow } from "zustand/shallow";
interface TotalChargeProps {
  charge: Charge;
  amountOfVotes: number;
}

const TotalCharge: React.FC<TotalChargeProps> = ({ charge: contestCharge, amountOfVotes }) => {
  const [totalCharge, setTotalCharge] = useState("0");
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
  });

  useEffect(() => {
    if (isNaN(amountOfVotes)) {
      setTotalCharge("0");
      return;
    }

    if (contestCharge.type.costToVote === 0 && contestCharge.type.costToPropose === 0) {
      setTotalCharge("0");
      return;
    }

    if (contestCharge.voteType === VoteType.PerVote) {
      setTotalCharge(getTotalCharge(amountOfVotes, currentPricePerVote));
    } else {
      setTotalCharge(formatEther(BigInt(contestCharge.type.costToVote)));
    }
  }, [contestCharge, amountOfVotes]);

  if (contestCharge.voteType === VoteType.PerTransaction) {
    return null;
  }

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
