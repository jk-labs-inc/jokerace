import { useContestStore } from "@hooks/useContest/store";
import FundPool from "../FundPool";
import RewardsTypeInfo from "./components/RewardsTypeInfo";
import RewardTypeSwitcher from "./components/RewardTypeSwitcher";
import { useShallow } from "zustand/shallow";
import { RewardPoolType, useCreateRewardsStore } from "../../store";
import { useEffect } from "react";
import { isVoterRewards } from "../../utils";

const CreateRewardsInitialStep = () => {
  const setRewardPoolType = useCreateRewardsStore(useShallow(state => state.setRewardPoolType));
  const version = useContestStore(useShallow(state => state.version));
  const supportsVoterRewards = isVoterRewards(version);

  useEffect(() => {
    if (!supportsVoterRewards) {
      setRewardPoolType(RewardPoolType.Winners);
    }
  }, [version, supportsVoterRewards, setRewardPoolType]);

  return (
    <div className="flex flex-col gap-6 animate-reveal">
      <div className="flex flex-col gap-4">
        <p className="text-neutral-11 text-[24px] font-bold">
          add rewards for{!supportsVoterRewards ? " contestants" : "..."}
        </p>
        {supportsVoterRewards && <RewardTypeSwitcher />}
      </div>
      <RewardsTypeInfo />
      <FundPool />
    </div>
  );
};

export default CreateRewardsInitialStep;
