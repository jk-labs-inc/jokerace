import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { Charge, VoteType } from "@hooks/useDeployContest/types";
import { usePathname } from "next/navigation";
import React from "react";
import { formatEther } from "viem";

interface ChargeInfoProps {
  charge: Charge;
}

const ChargeInfo: React.FC<ChargeInfoProps> = ({ charge }) => {
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const chainUnitLabel = chains.find((c: { name: string }) => c.name.toLowerCase() === chainName.toLowerCase())
    ?.nativeCurrency.symbol;
  const chargeAmount = charge.type.costToVote;
  const chargeLabel = charge.voteType === VoteType.PerVote ? "charge per vote" : "charge to vote";
  const entryChargeFormatted = formatEther(BigInt(chargeAmount));

  if (charge.type.costToPropose === 0 && charge.type.costToVote === 0) {
    return (
      <div className="flex justify-between text-neutral-9 text-[16px]">
        <p>charge to vote:</p>
        <p>gas fees only</p>
      </div>
    );
  }

  return (
    <div className="flex justify-between text-neutral-9 text-[16px]">
      <p>{chargeLabel}:</p>
      <p>
        {entryChargeFormatted} {chainUnitLabel}
      </p>
    </div>
  );
};

export default ChargeInfo;
