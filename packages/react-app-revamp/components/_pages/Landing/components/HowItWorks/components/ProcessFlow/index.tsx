import LandingPageHowItWorksProcessStepContainer from "./components/ProcessStep";

const LandingPageHowItWorksProcessFlow = () => {
  return (
    <div className="hidden md:flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <LandingPageHowItWorksProcessStepContainer>
          <img src="/landing/bubbles-ballot.png" alt="step 1" />
          <p className="text-neutral-11 font-sabo-filled text-2xl">
            buy votes early <br /> for cheap
          </p>
        </LandingPageHowItWorksProcessStepContainer>
        <img src="/landing/arrow-right.png" alt="arrow right" />
        <LandingPageHowItWorksProcessStepContainer>
          <img src="/landing/money.png" alt="step 2" />
          <p className="text-neutral-11 font-sabo-filled text-2xl">
            this funds the <br />
            rewards
          </p>
        </LandingPageHowItWorksProcessStepContainer>
        <img src="/landing/arrow-right.png" alt="arrow right" />
        <LandingPageHowItWorksProcessStepContainer>
          <img src="/landing/bubbles-money.png" alt="step 3" />
          <p className="text-neutral-11 font-sabo-filled text-2xl">
            earn by voting <br />
            up winners
          </p>
        </LandingPageHowItWorksProcessStepContainer>
      </div>
      <div className="bg-neutral-10 w-full h-px" />
    </div>
  );
};

export default LandingPageHowItWorksProcessFlow;
