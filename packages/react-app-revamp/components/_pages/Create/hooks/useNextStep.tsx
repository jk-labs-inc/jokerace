import { useDeployContestStore } from "@hooks/useDeployContest/store";

export const useNextStep = (validateSteps: Array<(arg?: any) => string | undefined>) => {
  const { setError, step, setStep, furthestStep, setFurthestStep } = useDeployContestStore(state => state);

  const onNextStep = (arg?: any) => {
    let hasError = false;

    for (const validateStep of validateSteps) {
      const errorMessage = validateStep(arg);
      if (errorMessage) {
        setError(step, { step, message: errorMessage });
        hasError = true;
        break; // Stop processing as soon as we encounter an error
      }
    }

    // If there were no errors, clear any previously set error message
    if (!hasError) {
      setError(step, { step, message: "" });
    }

    // Proceed to next step only if there were no errors
    if (!hasError) {
      const nextStep = step + 1;
      setStep(nextStep);

      if (nextStep > furthestStep) {
        setFurthestStep(nextStep);
      }
    }
  };

  return onNextStep;
};
