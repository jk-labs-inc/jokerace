import { useDeployRewardsPool } from "@hooks/useDeployRewards";
import CreateRewardsSubmitButton from "../../components/Buttons/Submit";
import { useCreateRewardsStore } from "../../store";
import { useFundPoolStore } from "../FundPool/store";
import CreateRewardsReviewTable from "./components/Table";
import { chains, config } from "@config/wagmi";
import { usePathname } from "next/navigation";
import { extractPathSegments } from "@helpers/extractPath";
import { useAccount } from "wagmi";
import { switchChain, switchNetwork } from "@wagmi/core";
import { toastError } from "@components/UI/Toast";

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
        <CreateRewardsSubmitButton step={currentStep} onSubmit={handleCreateRewards} />
        <p className="text-[16px] text-neutral-14">
          you cannot edit these rewards after confirming. <br /> you can always come back to fund more.
        </p>
      </div>
    </div>
  );
};

export default CreateRewardsReviewPool;
