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
  const { tokenWidgets } = useFundPoolStore(state => state);

  const handleCreateRewards = async () => {
    if (!contestChainId) return;

    if (contestChainId !== userChainId) {
      await switchChain(config, { chainId: contestChainId });
    }

    setStep(currentStep + 1);
    deployRewardsPool();
  };

  return (
    <div className="flex flex-col gap-16 animate-swingInLeft">
      <div className="flex flex-col gap-8">
        <p className="text-[24px] text-true-white font-bold">let's confirm</p>
        <CreateRewardsReviewTable
          rankings={rewardPoolData.rankings}
          shareAllocations={rewardPoolData.shareAllocations}
          tokens={tokenWidgets.filter(token => token.amount !== "0" && token.amount !== "")}
        />
        <p className="text-[14px] text-neutral-14 md:hidden">
          you cannot edit these rewards after confirming. <br /> you can always come back to fund more.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <CreateRewardsSubmitButton step={currentStep} onSubmit={handleCreateRewards} />

        <p className="text-[14px] text-neutral-14 hidden md:block">
          you cannot edit these rewards after confirming. <br /> you can always come back to fund more.
        </p>
      </div>
    </div>
  );
};

export default CreateRewardsReviewPool;
