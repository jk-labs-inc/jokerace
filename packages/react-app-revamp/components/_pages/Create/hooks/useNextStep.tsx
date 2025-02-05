import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useCallback } from "react";

export const useNextStep = () => {
  const { step: currentStep, setStep, errors } = useDeployContestStore(state => state);

  const onNextStep = useCallback(
    (targetStep?: number) => {
      const finalStep = targetStep ?? currentStep + 1;
      const isMovingForward = finalStep > currentStep;

      // console.log("errors", errors);

      // // only check for errors when moving forward
      // if (isMovingForward && errors.includes(currentStep)) {
      //   return;
      // }

      setStep(finalStep);
    },
    [currentStep, errors, setStep],
  );

  return onNextStep;
};
