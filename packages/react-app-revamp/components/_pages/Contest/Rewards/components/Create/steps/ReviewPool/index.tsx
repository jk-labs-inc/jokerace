import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { toastError } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useDeployRewardsPool } from "@hooks/useDeployRewards";
import { switchChain } from "@wagmi/core";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import CreateRewardsSubmitButton from "../../components/Buttons/Submit";
import { useCreateRewardsStore } from "../../store";
import { useFundPoolStore } from "../FundPool/store";
import CreateRewardsReviewTable from "./components/Table";

const CreateRewardsReviewPool = () => {
  const pathname = usePathname();
  const { chainName } = extractPathSegments(pathname);
  const contestChainId = chains.find(
    chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.id;
  const { chainId: userChainId } = useAccount();
  const { deployRewardsPool } = useDeployRewardsPool();
  const { rewardPoolData, currentStep, setStep } = useCreateRewardsStore(state => state);
  const { tokens } = useFundPoolStore(state => state);
  const isUserOnCorrectChain = contestChainId === userChainId;

  const handleSwitchNetwork = async () => {
    if (!contestChainId) return;

    try {
      await switchChain(config, { chainId: contestChainId });
    } catch (error) {
      toastError("failed to switch network");
    }
  };

  const handleCreateRewards = async () => {
    if (!contestChainId) return;

    if (contestChainId !== userChainId) {
      try {
        await switchChain(config, { chainId: contestChainId });
      } catch (error) {
        toastError("failed to switch network");
        return;
      }
    }

    setStep(currentStep + 1);
    deployRewardsPool();
  };

  return (
    <div className="flex flex-col gap-16 animate-swingInLeft">
      <div className="flex flex-col gap-8">
        <p className="text-[24px] text-true-white font-bold">let’s confirm</p>
        <CreateRewardsReviewTable
          rankings={rewardPoolData.rankings}
          shareAllocations={rewardPoolData.shareAllocations}
          tokens={tokens}
        />
      </div>
      <div className="flex flex-col gap-10">
        {isUserOnCorrectChain ? (
          <CreateRewardsSubmitButton step={currentStep} onSubmit={handleCreateRewards} />
        ) : (
          <ButtonV3
            colorClass="text-[20px] bg-gradient-create-pool rounded-[40px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
            size={ButtonSize.EXTRA_LARGE_LONG}
            onClick={handleSwitchNetwork}
          >
            switch network
          </ButtonV3>
        )}
        <p className="text-[16px] text-neutral-14">
          you cannot edit these rewards after confirming. <br /> you can always come back to fund more.
        </p>
      </div>
    </div>
  );
};

export default CreateRewardsReviewPool;
