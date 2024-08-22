import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { Charge } from "@hooks/useDeployContest/types";
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

    if (contestCharge.voteType === "PerVote") {
      const chargeAmount = parseFloat(formatEther(BigInt(contestCharge.type.costToVote)));
      const multipliedCharge = chargeAmount * amountOfVotes;
      const charge = +multipliedCharge.toFixed(6);
      setTotalCharge(charge.toString());
    } else {
      setTotalCharge(formatEther(BigInt(contestCharge.type.costToVote)));
    }
  }, [contestCharge, amountOfVotes]);

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
