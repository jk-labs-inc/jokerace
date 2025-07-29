import { toastDismiss } from "@components/UI/Toast";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useRouter } from "next/navigation";
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

const WARNING_MESSAGE_THRESHOLD = 10000;

const CreateContestDeploying = () => {
  const router = useRouter();
  const {
    isSuccess,
    deployContestData,
    votingMerkle: votingMerkleData,
    resetStore,
  } = useDeployContestStore(state => state);
  const { setShowRewards } = useShowRewardsStore(state => state);
  const votingMerkle = votingMerkleData.prefilled || votingMerkleData.csv;
  const hasLargeVoterList = votingMerkle && votingMerkle.voters.length > WARNING_MESSAGE_THRESHOLD;

  useEffect(() => {
    return () => {
      if (isSuccess) {
        resetStore();
      }
    };
  }, [resetStore, isSuccess]);

  useEffect(() => {
    if (!isSuccess || !deployContestData) {
      return;
    }

    const contestPath = `/contest/${deployContestData.chain.toLowerCase()?.replace(" ", "")}/${
      deployContestData.address
    }`;

    toastDismiss();

    if (deployContestData.sortingEnabled) {
      setShowRewards(true);
    }

    router.push(contestPath);
  }, [deployContestData, isSuccess, router, setShowRewards]);

  return (
    <div className="flex flex-col gap-4 mt-12 lg:mt-[100px] animate-swing-in-left">
      <p className="text-[24px] font-bold text-neutral-11 uppercase font-sabo">
        congratulations, you created a contest 👑
      </p>
      <p className="text-[18px] text-neutral-11">we'll redirect you to it as soon as it deploys...</p>
      <p className="text-[18px] text-neutral-11">while it's deploying, here's a fun gif:</p>

      <div className="relative w-[400px] border-4 border-true-black rounded-[10px] overflow-hidden">
        <div className="absolute top-0 left-0 bg-black py-1 px-2">
          <span className="text-[14px] text-true-black font-sabo font-bold">JOKETV</span>
        </div>
        <img
          src="https://media.giphy.com/media/xT8qB8JY8car00rGLe/giphy.gif"
          className="w-full h-full"
          alt="Loading GIF"
        />
      </div>

      {hasLargeVoterList && (
        <p className="text-[16px] text-neutral-11 italic">
          You seem to be trying to deploy a larger set of data; since this could take longer, don't reload the page.{" "}
          <br />
          please be patient and keep hallucinating at the gif above.
        </p>
      )}
    </div>
  );
};

export default CreateContestDeploying;
