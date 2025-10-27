/* eslint-disable react-hooks/exhaustive-deps */
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import moment from "moment-timezone";
import CreateNextButton from "../../components/Buttons/Next";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useContestSteps } from "../../hooks/useContestSteps";
import { useNextStep } from "../../hooks/useNextStep";
import CreateContestTimingVotingCloses from "./components/VotingCloses";
import CreateContestTimingVotingOpens from "./components/VotingOpens";

const CreateContestTiming = () => {
  const { steps } = useContestSteps();
  const { step, setVotingOpen, setVotingClose } = useDeployContestStore(state => state);
  const onNextStep = useNextStep();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const contestTitle = isMobile ? "how long is voting?" : "how long does voting run?";

  useEffect(() => {
    // Default voting opens to 1 week from now at 12:00pm ET
    const defaultVotingOpen = moment
      .tz("America/New_York")
      .add(7, "days")
      .hour(12)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate();
    // Default voting closes to 2 hours after voting opens
    const defaultVotingClose = moment(defaultVotingOpen).add(2, "hours").toDate();

    setVotingOpen(defaultVotingOpen);
    setVotingClose(defaultVotingClose);
  }, []);

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
            <div className="flex flex-col gap-4 w-[448px] rounded-4xl p-6 bg-primary-1 text-[16px] text-neutral-11">
              <p>entries can be submitted anytime before voting opens.</p>
              <p>
                <b>we recommend two hours to vote</b> so anyone can participate actively, as in a sports game.
              </p>
            </div>
            <CreateContestTimingVotingOpens />
            <CreateContestTimingVotingCloses />
            <div className="pl-6 text-[16px] text-neutral-9">
              <p>time zone: {moment.tz.guess()}</p>
            </div>
            <div className="mt-4 pl-6">
              <CreateNextButton step={step + 1} onClick={() => onNextStep()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestTiming;
