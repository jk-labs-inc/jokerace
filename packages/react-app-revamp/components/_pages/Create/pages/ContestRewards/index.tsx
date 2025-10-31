import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/shallow";
import CreateNextButton from "../../components/Buttons/Next";
import MobileStepper from "../../components/MobileStepper";
import StepCircle from "../../components/StepCircle";
import { useContestSteps } from "../../hooks/useContestSteps";
import { useNextStep } from "../../hooks/useNextStep";
import CreateRewardsPool from "./components/CreatePool";
import CreateRewardsFundPool from "./components/FundPool";
import { useFundPoolStore } from "./components/FundPool/store";

const CreateContestRewards = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { steps } = useContestSteps();
  const step = useDeployContestStore(useShallow(state => state.step));
  const contestTitle = isMobile ? "add voter rewards" : "add rewards for voters";
  const onNextStep = useNextStep();
  const { validateRewards } = useDeployContestStore(
    useShallow(state => ({
      validateRewards: state.validateRewards,
    })),
  );
  //TODO: double check this validation
  const isTokenWidgetError = useFundPoolStore(useShallow(state => state.isError));
  const isDisabled = !validateRewards().isValid || !!isTokenWidgetError;

  return (
    <div className="flex flex-col">
      {isMobile ? <MobileStepper currentStep={step} totalSteps={steps.length} /> : null}
      <div className="grid grid-cols-(--grid-full-width-create-flow) mt-12 lg:mt-[70px] animate-swing-in-left">
        <div className="col-span-1">
          <StepCircle step={step + 1} />
        </div>
        <div className="col-span-2 ml-10 md:pl-6">
          <p className="text-[24px] font-bold text-neutral-11">{contestTitle}</p>
        </div>
        <div className="grid col-start-1 md:col-start-2 col-span-2 md:ml-10 mt-8 md:mt-6">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 w-full md:w-[448px] rounded-4xl p-6 bg-primary-1 text-[16px] text-neutral-11">
              <p>
                the rewards pool will <b>self-fund.</b> as voters buy votes, 90% <br />
                of their funds will go into the pool.
              </p>
              <p>voters on winners can claim their share of rewards.</p>
            </div>
            <div className="flex flex-col gap-8 pl-6">
              <CreateRewardsPool />
              <CreateRewardsFundPool />
            </div>
            <div className="hidden md:block mt-4 pl-6">
              <CreateNextButton step={step + 1} onClick={() => onNextStep()} isDisabled={isDisabled} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestRewards;
