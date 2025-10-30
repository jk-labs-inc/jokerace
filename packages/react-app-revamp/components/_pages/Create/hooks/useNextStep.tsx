import { DeployContestStore, useDeployContestStore } from "@hooks/useDeployContest/store";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import { StepTitle, getStepNumber } from "../types";

const stepValidations: Record<StepTitle, (state: DeployContestStore, isConnected: boolean) => boolean> = {
  [StepTitle.Type]: state => {
    return true;
  },
  [StepTitle.Entries]: state => {
    return true;
  },

  [StepTitle.Timing]: state => {
    const validation = state.validateTiming();
    if (!validation.isValid) {
      state.setError(StepTitle.Timing, {
        step: getStepNumber(StepTitle.Timing),
        message: validation.error || "Invalid timing",
      });
      return false;
    }
    state.setError(StepTitle.Timing, { step: getStepNumber(StepTitle.Timing), message: "" });
    return true;
  },

  [StepTitle.Monetization]: (state, isConnected) => {
    return isConnected && !!state.charge.type.costToVote && state.charge.type.costToVote > 0;
  },
  [StepTitle.Rewards]: state => {
    const validation = state.validateRewards();
    if (!validation.isValid) {
      state.setError(StepTitle.Rewards, {
        step: getStepNumber(StepTitle.Rewards),
        message: validation.error || "Invalid rewards",
      });
      return false;
    }

    state.setError(StepTitle.Rewards, { step: getStepNumber(StepTitle.Rewards), message: "" });
    return true;
  },
  [StepTitle.Rules]: state => {
    return !!state.title && !!state.prompt.summarize && !!state.prompt.evaluateVoters;
  },

  [StepTitle.Confirm]: (state, isConnected) => {
    return isConnected;
  },
};

export const useNextStep = () => {
  const { isConnected } = useAccount();
  const { step: currentStep, setStep } = useDeployContestStore(state => state);

  const onNextStep = useCallback(
    (targetStep?: number, availableSteps?: StepTitle[]) => {
      // if we're going backwards, allow without validation
      if (targetStep !== undefined && targetStep < currentStep) {
        setStep(targetStep);
        return;
      }

      const state = useDeployContestStore.getState();

      // only validate steps that are in our current flow
      for (let i = currentStep; i < (targetStep ?? currentStep + 1); i++) {
        const stepToValidate = availableSteps?.[i];
        if (!stepToValidate) continue;

        const validationFn = stepValidations[stepToValidate];
        if (!validationFn) continue;

        const isValid = validationFn(state, isConnected);

        if (!isValid) {
          return;
        }
      }

      setStep(targetStep ?? currentStep + 1);
    },
    [currentStep, setStep, isConnected],
  );

  return onNextStep;
};
