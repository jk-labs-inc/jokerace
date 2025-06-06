import Image from "next/image";
import { FC } from "react";
import RewardsTiedStatusMessage from "./components/TiedStatusMessage";

interface RewardsPlayerTiedStatusProps {
  phase: "active" | "closed";
}

const RewardsPlayerTiedStatus: FC<RewardsPlayerTiedStatusProps> = ({ phase }) => {
  return (
    <div className="flex flex-col gap-4">
      <Image src="/rewards/rewards-tied.png" alt="rewards-losing" width={360} height={240} />
      <RewardsTiedStatusMessage phase={phase} />
    </div>
  );
};

export default RewardsPlayerTiedStatus;
