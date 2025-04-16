import CreateRewardsPool from "./steps/CreatePool";
import CreateRewardsDeploymentStatus from "./steps/DeploymentStatus";
import CreateRewardsFundPool from "./steps/FundPool";
import CreateRewardsReviewPool from "./steps/ReviewPool";
import { CreationStep, useCreateRewardsStore } from "./store";

export const createRewardsSteps = [
  {
    step: CreationStep.FundPool,
    component: CreateRewardsFundPool,
  },
  {
    step: CreationStep.CreatePool,
    component: CreateRewardsPool,
  },

  {
    step: CreationStep.Review,
    component: CreateRewardsReviewPool,
  },
  {
    step: CreationStep.DeploymentStatus,
    component: CreateRewardsDeploymentStatus,
  },
];

const CreateRewards = () => {
  const { currentStep } = useCreateRewardsStore(state => state);

  const CurrentStepComponent = createRewardsSteps.find(step => step.step === currentStep)?.component;

  return <div>{CurrentStepComponent ? <CurrentStepComponent /> : <div>Step not found</div>}</div>;
};

export default CreateRewards;
