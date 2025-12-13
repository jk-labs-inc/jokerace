import LandingHeaderMobileExplainerCreatorSection from "./components/CreatorSection";
import LandingHeaderMobileExplainerPlayerSection from "./components/PlayerSection";

const LandingHeaderMobileExplainer = () => {
  return (
    <div className="flex flex-col gap-6">
      <LandingHeaderMobileExplainerPlayerSection />
      <LandingHeaderMobileExplainerCreatorSection />
    </div>
  );
};

export default LandingHeaderMobileExplainer;
