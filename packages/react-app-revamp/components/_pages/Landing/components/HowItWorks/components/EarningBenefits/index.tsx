import EarnForBeliefs from "./components/EarnForBeliefs";
import EarnForConviction from "./components/EarnForConviction";

const LandingPageHowItWorksEarningBenefits = () => {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-12">
      <EarnForBeliefs />
      <div className="hidden md:block bg-neutral-10 w-px h-auto" />
      <EarnForConviction />
    </div>
  );
};

export default LandingPageHowItWorksEarningBenefits;
