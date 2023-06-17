import DialogModalV3 from "@components/UI/DialogModalV3";
import CreateRewardsPool from "@components/_pages/Rewards/components/Create";
import CreateRewardsFunding from "@components/_pages/Rewards/components/Fund";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import { useFundRewardsStore } from "@hooks/useFundRewards/store";
import { useEffect, useMemo, useState } from "react";

const CreateContestRewards = () => {
  const {
    isSuccess: isContestDeployed,
    setIsSuccess: setContestDeployed,
    reset: clearContestData,
  } = useDeployContestStore(state => state);
  const {
    displayCreatePool,
    isLoading: isRewardsModuleDeploying,
    isSuccess: isRewardsModuleDeployed,
    cancel: cancelCreateRewardsPool,
    reset: clearRewardsData,
  } = useDeployRewardsStore(state => state);

  const { isLoading: isFundingRewardsDeploying } = useFundRewardsStore(state => state);

  const { cancel: cancelFundingPool } = useFundRewardsStore(state => state);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!cancelCreateRewardsPool && !cancelFundingPool) return;

    setIsOpen(false);
  }, [cancelCreateRewardsPool, cancelFundingPool]);

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
      disableClose={isRewardsModuleDeploying || isFundingRewardsDeploying}
      title="rewards"
      className="xl:w-[1110px] 3xl:w-[1300px] h-[850px]"
    >
      <div className="md:pl-[50px] lg:pl-[100px]">
        <div className="pt-[50px]">{displayCreatePool ? <CreateRewardsPool /> : <CreateRewardsFunding />}</div>
      </div>
    </DialogModalV3>
  );
};

export default CreateContestRewards;
