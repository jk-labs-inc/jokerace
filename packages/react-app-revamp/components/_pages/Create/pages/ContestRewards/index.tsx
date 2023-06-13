import DialogModalV3 from "@components/UI/DialogModalV3";
import CreateRewardsPool from "@components/_pages/Rewards/components/Create";
import CreateRewardsFunding from "@components/_pages/Rewards/components/Fund";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import { useEffect, useState } from "react";

const CreateContestRewards = () => {
  const {
    isSuccess: isContestDeployed,
    setIsSuccess: setContestDeployed,
    reset: clearContestData,
  } = useDeployContestStore(state => state);
  const {
    isSuccess: isRewardsModuleDeployed,
    cancel: cancelCreateRewardsPool,
    reset: clearRewardsData,
  } = useDeployRewardsStore(state => state);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!cancelCreateRewardsPool) return;

    setIsOpen(false);
  }, [cancelCreateRewardsPool]);

  useEffect(() => {
    if (!isContestDeployed && !isRewardsModuleDeployed) return;

    setIsOpen(true);

    if (isContestDeployed) {
      setContestDeployed(false);
    }
  }, [isContestDeployed, isRewardsModuleDeployed]);

  const handleModalClose = () => {
    clearContestData();
    clearRewardsData();
  };

  return (
    <DialogModalV3
      isOpen={isOpen}
      setIsOpen={value => setIsOpen(value)}
      onClose={handleModalClose}
      title="rewards"
      className="xl:w-[1110px] 3xl:w-[1300px] h-[850px]"
    >
      <div className="pl-[100px]">
        <div className="pt-[50px]">{isRewardsModuleDeployed ? <CreateRewardsFunding /> : <CreateRewardsPool />}</div>
      </div>
    </DialogModalV3>
  );
};

export default CreateContestRewards;
