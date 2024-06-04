import CreateRewardsSubmitButton from "../../components/Buttons/Submit";
import { useCreateRewardsStore } from "../../store";
import { useFundPoolStore } from "../FundPool/store";
import CreateRewardsReviewTable from "./components/Table";

const CreateRewardsReviewPool = () => {
  const { rewardPoolData, currentStep } = useCreateRewardsStore(state => state);
  const { tokens } = useFundPoolStore(state => state);
  return (
    <div className="flex flex-col gap-16 animate-swingInLeft">
      <div className="flex flex-col gap-8">
        <p className="text-[24px] text-true-white font-bold">let’s confirm</p>
        <CreateRewardsReviewTable
          rankings={rewardPoolData.rankings}
          shareAllocations={rewardPoolData.shareAllocations}
          tokens={tokens}
        />
      </div>
      <div className="flex flex-col gap-10">
        <CreateRewardsSubmitButton step={currentStep} />
        <p className="text-[16px] text-neutral-14">
          you cannot edit these rewards after confirming. <br /> you can always come back to fund more.
        </p>
      </div>
    </div>
  );
};

export default CreateRewardsReviewPool;
