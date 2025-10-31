import { toastDismiss } from "@components/UI/Toast";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { create } from "zustand";
import { DeploymentStatus } from "../../components/DeploymentStatus";
import { canNavigateToContest } from "@hooks/useDeployContest/types";

interface ShowRewardsStore {
  showRewards: boolean;
  setShowRewards: (show: boolean) => void;
}

export const useShowRewardsStore = create<ShowRewardsStore>(set => ({
  showRewards: false,
  setShowRewards: show => set({ showRewards: show }),
}));

const CreateContestDeploying = () => {
  const router = useRouter();
  const { isSuccess, deployContestData, resetStore, deploymentProcess, addFundsToRewards } = useDeployContestStore(
    useShallow(state => ({
      isSuccess: state.isSuccess,
      deployContestData: state.deployContestData,
      resetStore: state.resetStore,
      deploymentProcess: state.deploymentProcess,
      addFundsToRewards: state.addFundsToRewards,
    })),
  );
  const { setShowRewards } = useShowRewardsStore(state => state);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (isSuccess) {
        resetStore();
      }
    };
  }, [resetStore, isSuccess]);

  useEffect(() => {
    const shouldNavigate = canNavigateToContest(deploymentProcess);
    const hasContestData = deployContestData && deployContestData.address;

    if (shouldNavigate && hasContestData && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;

      const contestPath = `/contest/${deployContestData.chain.toLowerCase()?.replace(" ", "")}/${
        deployContestData.address
      }`;

      toastDismiss();

      if (deployContestData.sortingEnabled) {
        setShowRewards(true);
      }

      router.push(contestPath);
    }
  }, [deploymentProcess, deployContestData, router, setShowRewards]);

  return (
    <div className="flex flex-col gap-8 mt-12 lg:mt-[100px] animate-swing-in-left">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-neutral-11 uppercase font-sabo-filled">
          congratulations, you created a contest 👑
        </p>
        <p className="text-[18px] text-neutral-11">we'll redirect you to it as soon as it deploys...</p>
      </div>
      <DeploymentStatus deploymentProcess={deploymentProcess} addFundsToRewards={addFundsToRewards} />
    </div>
  );
};

export default CreateContestDeploying;
