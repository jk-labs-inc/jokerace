import CreateRewardsPool from "./steps/CreatePool";
import CreateRewardsFundPool from "./steps/FundPool";
import CreateRewardsPoolInitialStep from "./steps/Initial";
import CreateRewardsReviewPool from "./steps/ReviewPool";
import { CreationStep, useCreateRewardsStore } from "./store";

export const createRewardsSteps = [
  {
    step: CreationStep.Initial,
    component: CreateRewardsPoolInitialStep,
  },
  {
    step: CreationStep.CreatePool,
    component: CreateRewardsPool,
  },
  {
    step: CreationStep.FundPool,
    component: CreateRewardsFundPool,
  },
  {
    step: CreationStep.Review,
    component: CreateRewardsReviewPool,
  },
];

const CreateRewards = () => {
  const { currentStep } = useCreateRewardsStore(state => state);

  const CurrentStepComponent = createRewardsSteps.find(step => step.step === currentStep)?.component;

  return <div>{CurrentStepComponent ? <CurrentStepComponent /> : <div>Step not found</div>}</div>;
};

export default CreateRewards;
