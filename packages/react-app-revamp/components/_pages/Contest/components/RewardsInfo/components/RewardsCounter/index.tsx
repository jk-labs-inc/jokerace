import { motion } from "motion/react";
import { FC } from "react";

interface RewardCounterProps {
  valueFormatted: string;
  symbol: string;
  index: number;
}

const RewardCounter: FC<RewardCounterProps> = ({ valueFormatted, symbol, index }) => {
  const truncatedSymbol = symbol.length > 6 ? symbol.slice(0, 6) : symbol;

  return (
    <motion.div
      key={`amount-${index}`}
      className="flex items-baseline gap-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.5,
      }}
      style={{ willChange: "transform, opacity" }}
    >
      <p className="text-neutral-11 text-[16px] md:text-[24px]">
        {valueFormatted} <span className="uppercase text-[16px]">${truncatedSymbol}</span>
      </p>
    </motion.div>
  );
};

export default RewardCounter;
