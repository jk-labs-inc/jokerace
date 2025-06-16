import { RewardPoolType, useCreateRewardsStore } from "@components/_pages/Contest/Rewards/components/Create/store";
import { motion } from "motion/react";
import { useShallow } from "zustand/shallow";

const options = [
  { type: RewardPoolType.Voters, label: "voters" },
  { type: RewardPoolType.Winners, label: "contestants" },
];

const RewardTypeSwitcher = () => {
  const { rewardPoolType, setRewardPoolType } = useCreateRewardsStore(
    useShallow(state => ({
      rewardPoolType: state.rewardPoolType,
      setRewardPoolType: state.setRewardPoolType,
    })),
  );

  return (
    <div className="w-full max-w-[350px]">
      <div className="relative h-10 text-[16px] w-full rounded-[40px] overflow-hidden bg-black">
        <div className="absolute inset-0 border border-neutral-14 rounded-[40px]" />

        <div className="relative z-10 flex h-full w-full">
          {options.map(({ type, label }) => {
            const isSelected = rewardPoolType === type;

            return (
              <button
                key={type}
                className="w-1/2 flex items-center justify-center"
                onClick={() => setRewardPoolType(type)}
              >
                <motion.span
                  initial={false}
                  animate={{
                    color: isSelected ? "#78FFC6" : "#E5E5E5",
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className={isSelected ? "font-bold" : "font-medium"}
                >
                  {label}
                </motion.span>
              </button>
            );
          })}
        </div>

        <motion.div
          layoutId="selectedType"
          className="absolute top-0 h-full w-1/2 border border-positive-11 rounded-[40px]"
          initial={false}
          animate={{
            x: rewardPoolType === RewardPoolType.Winners ? "100%" : "0%",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
};

export default RewardTypeSwitcher;
