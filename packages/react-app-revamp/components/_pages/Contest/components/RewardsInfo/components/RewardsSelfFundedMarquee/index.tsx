import GradientText from "@components/UI/GradientText";
import { FC } from "react";

const RewardsSelfFundedMarquee: FC = () => {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="h-4 w-[2px] bg-primary-2"></div>
      <GradientText
        gradientClassName="bg-gradient-purple"
        textSizeClassName="text-[12px] md:text-[16px] font-bold"
        isFontSabo={false}
      >
        rewards 🚀 as people play
      </GradientText>
    </div>
  );
};

export default RewardsSelfFundedMarquee;
