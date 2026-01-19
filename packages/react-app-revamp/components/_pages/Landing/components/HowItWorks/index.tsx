import LandingPageHowItWorksCreatorRewards from "./components/CreatorRewards";
import LandingPageHowItWorksEarningBenefits from "./components/EarningBenefits";
import LandingPageHowItWorksProcessFlow from "./components/ProcessFlow";

const LandingPageHowItWorks = () => {
  return (
    <div className="flex flex-col gap-9">
      <p className="text-neutral-11 md:text-neutral-9 font-sabo-filled text-2xl">how it works</p>
      <div className="flex flex-col gap-20 max-w-[1352px]">
        <LandingPageHowItWorksProcessFlow />
        <div className="flex flex-col gap-8 md:gap-32">
        <LandingPageHowItWorksEarningBenefits />
        <LandingPageHowItWorksCreatorRewards />
        </div>
      </div>
    </div>
  );
};


export default LandingPageHowItWorks;