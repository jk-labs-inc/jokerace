import { ModuleType } from "lib/rewards/types";
import { FC } from "react";
import { motion } from "motion/react";

interface RewardsMarqueeProps {
  moduleType: ModuleType;
}

const RewardsMarquee: FC<RewardsMarqueeProps> = ({ moduleType }) => {
  return (
    <div className="hidden md:flex items-center gap-4">
      <div className="hidden md:block h-4 w-[2px] bg-primary-2"></div>
      <div className="flex items-center gap-2 text-[16px]">
        <span>💸</span>
        <motion.span
          className="text-[16px] font-bold text-transparent bg-clip-text relative inline-block"
          style={{
            background: "linear-gradient(90deg, #FFE25B, #FFFAE1, #FFE25B, #FFFAE1, #FFE25B)",
            backgroundSize: "400% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            willChange: "background-position",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "400% 0%", "0% 0%"],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {moduleType === ModuleType.VOTER_REWARDS ? "vote & earn" : "enter & earn"}
        </motion.span>
        <span>💸</span>
      </div>
    </div>
  );
};

export default RewardsMarquee;
