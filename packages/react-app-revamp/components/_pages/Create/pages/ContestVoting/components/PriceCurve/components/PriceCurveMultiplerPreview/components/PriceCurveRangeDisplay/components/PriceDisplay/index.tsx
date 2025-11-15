import { formatBalance } from "@helpers/formatBalance";
import { FC } from "react";

interface PriceDisplayProps {
  price: string;
  label: string;
  chainUnitLabel: string;
}

const PriceDisplay: FC<PriceDisplayProps> = ({ price, label, chainUnitLabel }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-bold text-neutral-9">price/vote at {label}</p>
      <p className="text-2xl font-bold text-neutral-11">
        {formatBalance(price)} <span className="uppercase">{chainUnitLabel}</span>
      </p>
    </div>
  );
};

export default PriceDisplay;
