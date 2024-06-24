import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useCallback } from "react";
import { StateKey, validateField } from "../utils/validation";

type State = Record<StateKey, any>;

type Error = { step: number; message: string };

export const useNextStep = () => {
  const { setError, step: currentStep, setStep, stepConfig, ...state } = useDeployContestStore(state => state);

  const validateSteps = useCallback(
    (start: number, end: number, state: State): Error | null => {
      for (let step = start; step <= end; step++) {
        const config = stepConfig[step];
        if (!config) continue;

        for (const field of config.fields) {
          const errorMessage = validateField(field, state);
          if (errorMessage) {
            return { step, message: errorMessage };
          }
        }
      }
      return null;
    },
    [stepConfig],
  );

  const onNextStep = useCallback(
    (targetStep?: number) => {
      const finalStep = targetStep ?? currentStep + 1;
      const error = validateSteps(currentStep, finalStep - 1, state);

      if (error) {
        setError(error.step, error);
      } else {
        setError(currentStep, { step: currentStep, message: "" });
        setStep(finalStep);
      }
    },
    [currentStep, state, setError, setStep, validateSteps],
  );

  return onNextStep;
};
