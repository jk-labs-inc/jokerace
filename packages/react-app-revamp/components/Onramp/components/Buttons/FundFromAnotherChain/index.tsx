import { FC } from "react";

interface FundFromAnotherChainButtonProps {
  className?: string;
  handleFundFromAnotherChain?: () => void;
}

const FundFromAnotherChainButton: FC<FundFromAnotherChainButtonProps> = ({ handleFundFromAnotherChain, className }) => {
  return (
    <button
      className={`text-positive-11 hover:text-positive-9 transition-colors duration-300 ease-in-out font-bold text-[16px] ${className}`}
      onClick={handleFundFromAnotherChain}
    >
      or fund from another chain
    </button>
  );
};

export default FundFromAnotherChainButton;
