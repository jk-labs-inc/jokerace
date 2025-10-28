import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";
import moment from "moment-timezone";
import { useEffect } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useContestSteps } from "../../hooks/useContestSteps";
import { useNextStep } from "../../hooks/useNextStep";
import CreateContestTimingVotingCloses from "./components/VotingCloses";
import CreateContestTimingVotingOpens from "./components/VotingOpens";
import { useShallow } from "zustand/shallow";

const CreateContestTiming = () => {
  const { steps } = useContestSteps();
  const { step, errors, votingOpen, votingClose, validateTiming, setError } = useDeployContestStore(
    useShallow(state => ({
      step: state.step,
      errors: state.errors,
      votingOpen: state.votingOpen,
      votingClose: state.votingClose,
      validateTiming: state.validateTiming,
      setError: state.setError,
    })),
  );
  const onNextStep = useNextStep();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const contestTitle = isMobile ? "how long is voting?" : "how long does voting run?";
  const currentError = errors.find(error => error.step === 2);

  useEffect(() => {
    const validation = validateTiming();
    if (!validation.isValid) {
      setError(2, { step: 2, message: validation.error || "Invalid timing" });
    } else {
      setError(2, { step: 2, message: "" });
    }
  }, [votingOpen, votingClose, validateTiming, setError]);

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="grid grid-cols-(--grid-full-width-create-flow) mt-12 lg:mt-[70px] animate-swing-in-left">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10 pl-6">
          <p className="text-[24px] font-bold text-neutral-11">{contestTitle}</p>
        </div>
        <div className="grid col-start-1 md:col-start-2 col-span-2 md:ml-10 mt-8 md:mt-6">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 w-full md:w-[448px] rounded-4xl p-6 bg-primary-1 text-[16px] text-neutral-11">
              <p>entries can be submitted anytime before voting opens.</p>
              <p>
                <b>we recommend two hours to vote</b> so anyone can participate actively, as in a sports game.
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <CreateContestTimingVotingOpens />
              <CreateContestTimingVotingCloses />
              {currentError && currentError.message && (
                <div className="pl-6">
                  <p className="text-[20px] text-negative-11 font-medium">{currentError.message}</p>
                </div>
              )}
              <div className="pl-6 text-[20px] text-neutral-9">
                <p>time zone: {moment.tz.guess()}</p>
              </div>
            </div>
            <div className="mt-4 pl-6">
              <CreateNextButton step={step + 1} onClick={() => onNextStep()} isDisabled={!!currentError} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestTiming;
