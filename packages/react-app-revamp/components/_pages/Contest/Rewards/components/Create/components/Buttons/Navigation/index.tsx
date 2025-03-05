import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC, useState } from "react";
import { CreationStep, useCreateRewardsStore } from "../../../store";
import { useFundPoolStore } from "../../../steps/FundPool/store";
import { useMediaQuery } from "react-responsive";
import MobileBottomButton from "@components/_pages/Create/components/Buttons/Mobile";

interface CreateRewardsNavigationProps {
  step: number;
  isDisabled?: boolean;
  isError?: boolean;
}

const fundPoolErrorMessage = "ruh roh! it looks like you have duplicate widgets with same token!";
const fundPoolIsDisabledMessage = "insufficient balance";

const CreateRewardsNavigation: FC<CreateRewardsNavigationProps> = ({ step, isDisabled = false, isError = false }) => {
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });
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

  if (isMobileOrTablet) {
    return (
      <MobileBottomButton>
        <div
          className={`flex flex-row items-center h-12 ${step === 0 && enableSkipButton ? "justify-end" : "justify-between"} border-t-neutral-2 border-t-2 px-8`}
        >
          {step > 0 && (
            <p className="text-[20px] text-neutral-11" onClick={() => onBackHandler(step)}>
              back
            </p>
          )}
          <ButtonV3
            isDisabled={isDisabled}
            onClick={onNextHandler}
            colorClass={`text-[20px] ${enableSkipButton ? "bg-gradient-gray" : "bg-gradient-purple"} rounded-[15px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out`}
          >
            {getButtonText(step, isDisabled, enableSkipButton)}
          </ButtonV3>
          {showError && (
            <p className="text-[16px] text-negative-11 font-bold animate-appear absolute top-[-30px] left-0 right-0 text-center">
              {errorMessage}
            </p>
          )}
        </div>
      </MobileBottomButton>
    );
  }

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
        {step > 0 && (
          <div
            className="flex items-center gap-[5px] -ml-[15px] cursor-pointer group"
            onClick={() => onBackHandler(step)}
          >
            <div className="transition-transform duration-200 group-hover:-translate-x-1">
              <img src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
            </div>
            <p className="text-[16px]">back</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRewardsNavigation;
