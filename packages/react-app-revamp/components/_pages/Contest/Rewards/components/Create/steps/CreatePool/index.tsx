import CreateRewardsNavigation from "@components/_pages/Contest/Rewards/components/Create/components/Buttons/Navigation";
import { ValidationError, useCreateRewardsStore } from "@components/_pages/Contest/Rewards/components/Create/store";
import { useShallow } from "zustand/shallow";
import CreateRewardsPoolRecipients from "./components/Recipients";

const hasValidationErrors = (errors: ValidationError): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};

const CreateRewardsPoolVotersInfo = () => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[16px] text-neutral-11">
        now decide what percent of the rewards pool <br />
        voters get for voting on each rank.
      </p>
      <p className="text-[16px] text-neutral-11">
        for example, anyone who successfully votes on <br />
        1st place could get their proportionate share of <br />
        80% of rewards.
      </p>
    </div>
  );
};

const CreateRewardsPool = () => {
  const { currentStep, rewardPoolData } = useCreateRewardsStore(
    useShallow(state => ({
      currentStep: state.currentStep,
      rewardPoolData: state.rewardPoolData,
    })),
  );
  const isError = hasValidationErrors(rewardPoolData.validationError);

  return (
    <div className="flex flex-col gap-12 animate-swing-in-left">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">how much do voters get?</p>
        <CreateRewardsPoolVotersInfo />
      </div>
      <CreateRewardsPoolRecipients />

      <CreateRewardsNavigation step={currentStep} isDisabled={isError} />
    </div>
  );
};

export default CreateRewardsPool;
