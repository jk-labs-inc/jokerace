import GradientText from "@components/UI/GradientText";
import { ModuleType } from "lib/rewards/types";
import { FC } from "react";

interface RewardsMarqueeProps {
  moduleType: ModuleType;
}

const RewardsMarquee: FC<RewardsMarqueeProps> = ({ moduleType }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:block h-4 w-[2px] bg-primary-2"></div>
      <div className=" flex items-center gap-2 text-[16px]">
        <span>💸</span>
        <GradientText gradientClassName="bg-gradient-gold" textSizeClassName="text-[12px] font-bold" isFontSabo={false}>
          {moduleType === ModuleType.VOTER_REWARDS ? "vote & earn" : "enter & earn"}
        </GradientText>{" "}
        <span>💸</span>
      </div>
    </div>
  );
};

export default RewardsMarquee;
