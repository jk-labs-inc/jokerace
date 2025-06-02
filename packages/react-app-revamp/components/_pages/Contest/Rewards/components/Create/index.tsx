import CreateRewardsPool from "./steps/CreatePool";
import CreateRewardsDeploymentStatus from "./steps/DeploymentStatus";
import CreateRewardsInitialStep from "./steps/Initial";
import CreateRewardsReviewPool from "./steps/ReviewPool";
import { CreationStep, useCreateRewardsStore } from "./store";
import { useShallow } from "zustand/shallow";

export const createRewardsSteps = [
  {
    step: CreationStep.InitialStep,
    component: CreateRewardsInitialStep,
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
  const currentStep = useCreateRewardsStore(useShallow(state => state.currentStep));

  const CurrentStepComponent = createRewardsSteps.find(step => step.step === currentStep)?.component;

  return <div>{CurrentStepComponent ? <CurrentStepComponent /> : <div>Step not found</div>}</div>;
};

export default CreateRewards;
