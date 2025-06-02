import GradientText from "@components/UI/GradientText";
import { formatBalance } from "@helpers/formatBalance";
import { motion } from "motion/react";
import { FC } from "react";
import { formatUnits } from "viem";

interface RewardCounterProps {
  amount: bigint;
  decimals: number;
  symbol: string;
  index: number;
}

const RewardCounter: FC<RewardCounterProps> = ({ amount, decimals, symbol, index }) => {
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
      <GradientText
        gradientClassName="bg-gradient-create"
        textSizeClassName="text-[14px] md:text-[24px] font-bold"
        isFontSabo={false}
      >
        {formatBalance(formatUnits(amount ?? 0n, decimals ?? 18))}{" "}
        <span className="uppercase text-[12px] md:text-[16px] font-bold">${symbol}</span>
      </GradientText>
    </motion.div>
  );
};

export default RewardCounter;
