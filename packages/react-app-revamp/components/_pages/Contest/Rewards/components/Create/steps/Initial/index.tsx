import FundPool from "../FundPool";
import RewardsTypeInfo from "./components/RewardsTypeInfo";

const CreateRewardsInitialStep = () => {
  return (
    <div className="flex flex-col gap-6 animate-reveal">
      <div className="flex flex-col gap-4">
        <p className="text-neutral-11 text-[24px] font-bold">add rewards for voters</p>
      </div>
      <RewardsTypeInfo />
      <FundPool />
    </div>
  );
};

export default CreateRewardsInitialStep;
