import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { getTotalCharge } from "@helpers/totalCharge";
import { Charge, VoteType } from "@hooks/useDeployContest/types";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formatEther } from "viem";
interface TotalChargeProps {
  charge: Charge;
  amountOfVotes: number;
}

const TotalCharge: React.FC<TotalChargeProps> = ({ charge: contestCharge, amountOfVotes }) => {
  const [totalCharge, setTotalCharge] = useState("0");
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const chainUnitLabel = chains.find((c: { name: string }) => c.name.toLowerCase() === chainName.toLowerCase())
    ?.nativeCurrency.symbol;

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
      setTotalCharge(getTotalCharge(amountOfVotes, contestCharge.type.costToVote));
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
        {totalCharge} {chainUnitLabel}
      </p>
    </div>
  );
};

export default TotalCharge;
