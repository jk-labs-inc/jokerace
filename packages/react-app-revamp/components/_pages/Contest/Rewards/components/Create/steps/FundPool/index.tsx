import { useContestStore } from "@hooks/useContest/store";
import CreateRewardsNavigation from "../../components/Buttons/Navigation";
import { useCreateRewardsStore } from "../../store";
import TokenWidgets from "./components/TokenWidgets";
import { useFundPoolStore } from "./store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import CreateRewardsAddEarningsToggle from "../ReviewPool/components/AddEarnings";
import CreateRewardsAddFundsToggle from "../ReviewPool/components/AddFunds";

const CreateRewardsFundPool = () => {
  const charge = useContestStore(state => state.charge);
  const contestState = useContestStateStore(state => state.contestState);
  const isContestFinishedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
  const enableEarningsToggle = charge && charge.percentageToCreator > 0 && !isContestFinishedOrCanceled;
  const { currentStep, addFundsToRewards } = useCreateRewardsStore(state => state);
  const { isError, tokenWidgets } = useFundPoolStore(state => state);
  const allTokensUnique = tokenWidgets.length === new Set(tokenWidgets.map(token => token.address)).size;

  return (
    <div className="flex flex-col gap-12 animate-swingInLeft">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">time to have fun(ds)</p>
        <p className="text-[16px] text-neutral-11">now let’s fund your rewards pool.</p>
      </div>

      <div className="flex flex-col gap-8">
        {enableEarningsToggle && <CreateRewardsAddEarningsToggle />}
        <CreateRewardsAddFundsToggle />

        {addFundsToRewards && <TokenWidgets />}
      </div>

      <CreateRewardsNavigation step={currentStep} isDisabled={isError} isError={!allTokensUnique} />
    </div>
  );
};

export default CreateRewardsFundPool;
