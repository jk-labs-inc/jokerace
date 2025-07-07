import { FC } from "react";

interface CostToEnterMessageProps {
  costToPropose: number;
  nativeCurrencySymbol?: string;
}

const CostToEnterMessage: FC<CostToEnterMessageProps> = ({ costToPropose, nativeCurrencySymbol }) => {
  return (
    <li className="text-[16px]">
      {costToPropose} <span className="uppercase">${nativeCurrencySymbol}</span> to enter
    </li>
  );
};

export default CostToEnterMessage;
