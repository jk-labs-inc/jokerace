import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { steps } from "../..";
import CreateNextButton from "../../components/Buttons/Next";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import { usePreviousStep } from "../../hooks/usePreviousStep";
import CreateContestCharge from "./components/Charge";
import CreateContestChargeUnconnectedAccount from "./components/UnconnectedAccount";
import CreateContestChargeUnsupportedChain from "./components/UnsupportedChain";

const CreateContestMonetization = () => {
  const { step, mobileStepTitle, resetMobileStepTitle, votingRequirementsOption } = useDeployContestStore(
    state => state,
  );
  const { isConnected, chain } = useAccount();
  const [disableNextStep, setDisableNextStep] = useState(false);
  const [unsupportedChain, setUnsupportedChain] = useState(false);
  const onNextStep = useNextStep();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const monetizeTitle = isMobile ? `let’s monetize` : `let’s monetize this puppy`;
  const onPreviousStep = usePreviousStep();

  const handleNextStepMobile = useCallback(() => {
    if (!mobileStepTitle) return;

    if (mobileStepTitle === steps[step].title) {
      onNextStep();
      resetMobileStepTitle();
    }
  }, [mobileStepTitle, onNextStep, resetMobileStepTitle, step]);

  // Mobile listeners
  useEffect(() => {
    handleNextStepMobile();
  }, [handleNextStepMobile]);

  useEffect(() => {
    setUnsupportedChain(false);
  }, [chain]);

  const switchLayout = useMemo<JSX.Element>(() => {
    if (!isConnected) {
      return <CreateContestChargeUnconnectedAccount />;
    } else if (unsupportedChain) {
      if (votingRequirementsOption.value === "anyone") {
        onPreviousStep();
      }
      return <CreateContestChargeUnsupportedChain />;
    }

    return (
      <CreateContestCharge
        isConnected={isConnected}
        chain={chain?.name.toLowerCase() ?? ""}
        onError={value => setDisableNextStep(value)}
        onUnsupportedChain={value => setUnsupportedChain(value)}
      />
    );
  }, [chain?.name, isConnected, onPreviousStep, unsupportedChain, votingRequirementsOption.value]);

  return (
    <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="col-span-1">
        <StepCircle step={step + 1} />
      </div>
      <div className="col-span-2 ml-10">
        <p className="text-[24px] text-primary-10 font-bold">{monetizeTitle}</p>
      </div>
      <div className="grid col-start-1 md:col-start-2 col-span-2  md:ml-10 mt-8 md:mt-14">
        {switchLayout}
        <div className="mt-16">
          <CreateNextButton step={step + 1} isDisabled={disableNextStep} onClick={() => onNextStep()} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestMonetization;
