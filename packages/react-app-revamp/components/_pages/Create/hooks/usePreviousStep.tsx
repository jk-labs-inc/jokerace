import { useDeployContestStore } from "@hooks/useDeployContest/store";

export const usePreviousStep = () => {
  const { step, setStep } = useDeployContestStore(state => state);

  const onPreviousStep = () => {
    // Ensure step isn't already at the start
    if (step > 0) {
      const previousStep = step - 1;
      setStep(previousStep);
    }
  };

  return onPreviousStep;
};
