import CreateRewardsNavigation from "@components/_pages/Contest/Rewards/components/Create/components/Buttons/Navigation";
import {
  RewardPoolType,
  ValidationError,
  useCreateRewardsStore,
} from "@components/_pages/Contest/Rewards/components/Create/store";
import CreateRewardsPoolRecipients from "./components/Recipients";
import { useShallow } from "zustand/shallow";

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

const CreateRewardsPoolWinnersInfo = () => {
  return (
    <p className="text-[16px] text-neutral-11">
      now decide what percent of the rewards pool <br />
      each contestant gets.
    </p>
  );
};

const CreateRewardsPool = () => {
  const { currentStep, rewardPoolData, rewardPoolType } = useCreateRewardsStore(
    useShallow(state => ({
      currentStep: state.currentStep,
      rewardPoolData: state.rewardPoolData,
      rewardPoolType: state.rewardPoolType,
    })),
  );
  const title = rewardPoolType === RewardPoolType.Voters ? "how much do voters get?" : "how much does contestant get?";
  const isError = hasValidationErrors(rewardPoolData.validationError);

  return (
    <div className="flex flex-col gap-12 animate-swing-in-left">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">{title}</p>
        {rewardPoolType === RewardPoolType.Voters ? <CreateRewardsPoolVotersInfo /> : <CreateRewardsPoolWinnersInfo />}
      </div>
      <CreateRewardsPoolRecipients />

      <CreateRewardsNavigation step={currentStep} isDisabled={isError} />
    </div>
  );
};

export default CreateRewardsPool;
