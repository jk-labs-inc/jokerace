import { returnOnlySuffix } from "@helpers/ordinalSuffix";
import { FC } from "react";
import RewardsTiedStatusMessage from "../TiedStatus/components/TiedStatusMessage";

interface RewardsPlayerTiedRewardsProps {
  rank: number;
  phase: "active" | "closed";
}

const RewardsPlayerTiedRewards: FC<RewardsPlayerTiedRewardsProps> = ({ rank, phase }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] text-neutral-9 font-bold">
        {rank}
        <sup>{returnOnlySuffix(rank)}</sup> place
      </p>
      <RewardsTiedStatusMessage phase={phase} />
    </div>
  );
};

export default RewardsPlayerTiedRewards;
