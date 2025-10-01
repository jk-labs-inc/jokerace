import { formatBalance } from "@helpers/formatBalance";
import { FC } from "react";
import { motion } from "motion/react";

interface MyVotesProps {
  balance: string;
  symbol: string;
  insufficientBalance: boolean;
  onAddFunds?: () => void;
}

const MyVotes: FC<MyVotesProps> = ({ balance, symbol, insufficientBalance, onAddFunds }) => {
  return (
    <div
      className={`flex justify-between pl-6 pr-2 items-center text-[16px] ${
        insufficientBalance ? "text-negative-11" : "text-neutral-11"
      } transition-colors duration-300`}
    >
      <p className="text-neutral-9 font-bold">
        balance: {formatBalance(balance)} {symbol}
      </p>

      {!insufficientBalance && (
        <motion.button
          onClick={onAddFunds}
          className="w-24 h-6 flex items-center justify-center bg-positive-15 border border-positive-16 rounded-[40px] text-positive-11 font-bold"
          style={{ willChange: "transform" }}
          whileTap={{ scale: 0.97 }}
        >
          add funds
        </motion.button>
      )}
    </div>
  );
};

export default MyVotes;
