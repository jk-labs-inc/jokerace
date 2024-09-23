import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import Image from "next/image";
import { FC, useState } from "react";
import { CreationStep, useCreateRewardsStore } from "../../../store";
import { useFundPoolStore } from "../../../steps/FundPool/store";

interface CreateRewardsNavigationProps {
  step: number;
  isDisabled?: boolean;
  isError?: boolean;
}

const fundPoolErrorMessage = "ruh roh! it looks like you have duplicate widgets with same token!";
const fundPoolIsDisabledMessage = "insufficient balance";

const CreateRewardsNavigation: FC<CreateRewardsNavigationProps> = ({ step, isDisabled = false, isError = false }) => {
  const tokenWidgets = useFundPoolStore(state => state.tokenWidgets);
  const { setStep, addEarningsToRewards } = useCreateRewardsStore(state => state);
  const isAnyTokenPositive = tokenWidgets.some(token => token.amount !== "0" && token.amount !== "");
  const enableSkipButton = step === CreationStep.FundPool && !addEarningsToRewards && !isAnyTokenPositive;
  const errorMessage = isError && step === CreationStep.FundPool ? fundPoolErrorMessage : "";
  const [showError, setShowError] = useState(false);

  const onNextHandler = () => {
    if (isError) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setStep(step + 1);
  };

  const onBackHandler = (step: number) => {
    setShowError(false);
    setStep(step - 1);
  };

  const getButtonText = (step: number, isDisabled: boolean, enableSkipButton: boolean): string => {
    if (step === CreationStep.FundPool) {
      if (isDisabled) {
        return fundPoolIsDisabledMessage;
      }
      if (enableSkipButton) {
        return "skip";
      }
    }

    return "next";
  };

  return (
    <div className="flex gap-4 flex-col items-start">
      {showError ? <p className="text-[16px] text-negative-11 font-bold animate-appear">{errorMessage}</p> : null}
      <div className="flex flex-col gap-2 items-center">
        <ButtonV3
          colorClass={`text-[20px] ${enableSkipButton ? "bg-gradient-gray" : "bg-gradient-purple"} rounded-[40px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out`}
          size={ButtonSize.EXTRA_LARGE_LONG}
          onClick={onNextHandler}
          isDisabled={isDisabled}
        >
          {getButtonText(step, isDisabled, enableSkipButton)}
        </ButtonV3>
        <div
          className="flex items-center gap-[5px] -ml-[15px] cursor-pointer group"
          onClick={() => onBackHandler(step)}
        >
          <div className="transition-transform duration-200 group-hover:-translate-x-1">
            <Image src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
          </div>
          <p className="text-[16px]">back</p>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsNavigation;
