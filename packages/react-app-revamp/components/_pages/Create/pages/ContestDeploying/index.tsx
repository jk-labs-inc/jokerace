/* eslint-disable react/no-unescaped-entities */

import { toastDismiss, toastLoading } from "@components/UI/Toast";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { create } from "zustand";

interface ShowRewardsStore {
  showRewards: boolean;
  setShowRewards: (show: boolean) => void;
}

export const useShowRewardsStore = create<ShowRewardsStore>(set => ({
  showRewards: false,
  setShowRewards: show => set({ showRewards: show }),
}));

const CreateContestDeploying = () => {
  const { isSuccess, deployContestData } = useDeployContestStore(state => state);
  const router = useRouter();
  const { setShowRewards } = useShowRewardsStore(state => state);

  useEffect(() => {
    if (isSuccess) {
      toastDismiss();
      toastLoading("redirecting to the contest page..", false);
      setTimeout(() => {
        toastDismiss();
        router.push(`/contest/${deployContestData.chain.toLowerCase()?.replace(" ", "")}/${deployContestData.address}`);

        setShowRewards(true);
      }, 5000);
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-4 mt-12 lg:mt-[100px] animate-swingInLeft">
      <p className="text-[24px] font-bold text-primary-10 uppercase font-sabo">
        congratulations, you reached the end! 🥳
      </p>
      <hr className="w-[60px] border-neutral-10" />
      <p className="text-[18px] text-neutral-11">while we deploy your contest, kindly wait a moment.</p>
      <p className="text-[18px] text-neutral-11">shortly you'll be redirected to the contest page!</p>
    </div>
  );
};

export default CreateContestDeploying;
