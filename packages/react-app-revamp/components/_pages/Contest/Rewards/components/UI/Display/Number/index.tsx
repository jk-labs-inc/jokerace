import { formatBalance } from "@helpers/formatBalance";
import { FC } from "react";
import { formatUnits } from "viem";

interface RewardsNumberDisplayProps {
  value: bigint;
  symbol: string;
  decimals: number;
  index: number;
  isBold?: boolean;
}

const RewardsNumberDisplay: FC<RewardsNumberDisplayProps> = ({ value, symbol, decimals, index, isBold = false }) => {
  return (
    <p key={index} className={`text-[40px] leading-none text-neutral-11 ${isBold ? "font-bold" : ""}`}>
      {formatBalance(formatUnits(value, decimals))}
      <span className="text-[16px] text-neutral-9 font-bold ml-1">{symbol}</span>
    </p>
  );
};

export default RewardsNumberDisplay;
