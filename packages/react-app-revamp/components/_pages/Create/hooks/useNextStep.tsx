import { useDeployContestStore } from "@hooks/useDeployContest/store";

export const useNextStep = (validateStep: () => string) => {
  const { setError, step, setStep, furthestStep, setFurthestStep } = useDeployContestStore(state => state);

  const onNextStep = () => {
    const errorMessage = validateStep();
    setError(step, { step, message: errorMessage });

    if (errorMessage === "") {
      const nextStep = step + 1;
      setStep(nextStep);

      if (nextStep > furthestStep) {
        setFurthestStep(nextStep);
      }
    }
  };

  return onNextStep;
};
