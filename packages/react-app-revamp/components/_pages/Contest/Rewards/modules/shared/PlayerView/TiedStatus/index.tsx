import { FC } from "react";
import RewardsTiedStatusMessage from "./components/TiedStatusMessage";

interface RewardsPlayerTiedStatusProps {
  phase: "active" | "closed";
}

const RewardsPlayerTiedStatus: FC<RewardsPlayerTiedStatusProps> = ({ phase }) => {
  return (
    <div className="flex flex-col gap-4">
      <img src="/rewards/rewards-tied.png" alt="rewards-losing" />
      <RewardsTiedStatusMessage phase={phase} />
    </div>
  );
};

export default RewardsPlayerTiedStatus;
