import BuildProtocolSection from "./sections/BuildProtocol";
import CreateContestSection from "./sections/CreateContest";
import HowItWorksSection from "./sections/HowItWorks";
import SubscribeSection from "./sections/Subscribe";

const LandingPageExplainer = () => {
  return (
    <div className="flex flex-col gap-8 md:gap-12 pl-4 pr-4 md:pl-16 md:pr-16 3xl:pl-20 2xl:pr-0">
      <SubscribeSection />
      <HowItWorksSection />
      <CreateContestSection />
      <BuildProtocolSection />
    </div>
  );
};

export default LandingPageExplainer;
