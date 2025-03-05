import CreateRewardsNavigation from "@components/_pages/Contest/Rewards/components/Create/components/Buttons/Navigation";
import { ValidationError, useCreateRewardsStore } from "@components/_pages/Contest/Rewards/components/Create/store";
import CreateRewardsPoolRecipients from "./components/Recipients";
import { useMediaQuery } from "react-responsive";

const hasValidationErrors = (errors: ValidationError): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};

const CreateRewardsPool = () => {
  const { currentStep, rewardPoolData } = useCreateRewardsStore(state => state);
  const isError = hasValidationErrors(rewardPoolData.validationError);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="flex flex-col gap-12 animate-swingInLeft">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">how much does everyone get?</p>
        <p className="text-[16px] text-neutral-11">
          now decide what percent of the rewards pool <br />
          each person gets.
        </p>
      </div>
      <CreateRewardsPoolRecipients />

      <CreateRewardsNavigation step={currentStep} isDisabled={isError} />
    </div>
  );
};

export default CreateRewardsPool;
