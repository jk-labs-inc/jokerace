import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useShallow } from "zustand/react/shallow";

export const usePreviousStep = () => {
  const { step, setStep } = useDeployContestStore(
    useShallow(state => ({
      step: state.step,
      setStep: state.setStep,
    })),
  );

  const onPreviousStep = () => {
    // Ensure step isn't already at the start
    if (step > 0) {
      const previousStep = step - 1;
      setStep(previousStep);
    }
  };

  return onPreviousStep;
};
