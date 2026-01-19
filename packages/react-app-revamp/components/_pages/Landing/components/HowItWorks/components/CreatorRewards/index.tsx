import CreateContests from "./components/CreateContests";
import FundsDistribution from "./components/FundsDistribution";

const LandingPageHowItWorksCreatorRewards = () => {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:gap-12 md:items-start">
      <CreateContests />
      <FundsDistribution />
    </div>
  );
};

export default LandingPageHowItWorksCreatorRewards;
