import DialogModalV3 from "@components/UI/DialogModalV3";
import CreateRewardsPool from "@components/_pages/Rewards/components/Create";
import CreateRewardsFunding from "@components/_pages/Rewards/components/Fund";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import { useFundRewardsStore } from "@hooks/useFundRewards/store";
import { useEffect, useState } from "react";
import { useShowRewardsStore } from "../ContestDeploying";

const CreateContestRewards = () => {
  const { reset: clearContestData, isSuccess: contestDeployed } = useDeployContestStore(state => state);
  const {
    displayCreatePool,
    isLoading: isRewardsModuleDeploying,
    cancel: cancelCreateRewardsPool,
    reset: clearRewardsData,
  } = useDeployRewardsStore(state => state);
  const { setShowRewards } = useShowRewardsStore(state => state);
  const { isLoading: isFundingRewardsDeploying } = useFundRewardsStore(state => state);
  const { cancel: cancelFundingPool } = useFundRewardsStore(state => state);

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (contestDeployed) {
      clearContestData();
    }
  }, [clearContestData, contestDeployed]);

  useEffect(() => {
    if (!cancelCreateRewardsPool && !cancelFundingPool) return;

    setIsOpen(false);
  }, [cancelCreateRewardsPool, cancelFundingPool]);

  const handleModalClose = () => {
    setShowRewards(false);
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
      <div className="md:pl-[50px] lg:pl-[100px]">
        <div className="pt-[50px]">{displayCreatePool ? <CreateRewardsPool /> : <CreateRewardsFunding />}</div>
      </div>
    </DialogModalV3>
  );
};

export default CreateContestRewards;
