import { FC } from "react";
import CreateFlowMonetizationInput from "@components/_pages/Create/components/MonetizationInput";

interface FlatPricingOptionProps {
  costToVote: number;
  label: string;
  errorMessage?: string;
  onPriceChange?: (value: number) => void;
}

const FlatPricingOption: FC<FlatPricingOptionProps> = ({ costToVote, label, errorMessage, onPriceChange }) => {
  return (
    <CreateFlowMonetizationInput
      value={costToVote}
      label={label}
      onChange={onPriceChange}
      errorMessage={errorMessage}
    />
  );
};

export default FlatPricingOption;
