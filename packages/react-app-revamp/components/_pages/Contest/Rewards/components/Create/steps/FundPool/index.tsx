import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { useShallow } from "zustand/shallow";
import CreateRewardsNavigation from "../../components/Buttons/Navigation";
import { useCreateRewardsStore } from "../../store";
import CreateRewardsAddEarningsToggle from "../ReviewPool/components/AddEarnings";
import CreateRewardsAddFundsToggle from "../ReviewPool/components/AddFunds";
import TokenWidgets from "./components/TokenWidgets";
import { useFundPoolStore } from "./store";

const CreateRewardsFundPool = () => {
  const charge = useContestStore(useShallow(state => state.charge));
  const contestState = useContestStateStore(useShallow(state => state.contestState));
  const isContestFinishedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
  const enableEarningsToggle = charge && charge.percentageToCreator > 0 && !isContestFinishedOrCanceled;
  const { currentStep, addFundsToRewards, addEarningsToRewards } = useCreateRewardsStore(
    useShallow(state => ({
      currentStep: state.currentStep,
      addFundsToRewards: state.addFundsToRewards,
      addEarningsToRewards: state.addEarningsToRewards,
    })),
  );
  const { isError, tokenWidgets } = useFundPoolStore(
    useShallow(state => ({
      isError: state.isError,
      tokenWidgets: state.tokenWidgets,
    })),
  );
  const allTokensUnique = tokenWidgets.length === new Set(tokenWidgets.map(token => token.address)).size;
  const hasZeroAmountToken = tokenWidgets.some(token => token.amount === "0" || token.amount === "");

  const isNavigationDisabled =
    (!addEarningsToRewards && !addFundsToRewards) ||
    (addFundsToRewards && (tokenWidgets.length === 0 || hasZeroAmountToken)) ||
    isError ||
    !allTokensUnique;

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-8">
        {enableEarningsToggle && <CreateRewardsAddEarningsToggle percentageToCreator={charge?.percentageToCreator} />}
        <CreateRewardsAddFundsToggle />

        {addFundsToRewards && <TokenWidgets />}
      </div>

      <CreateRewardsNavigation step={currentStep} isDisabled={isNavigationDisabled} isError={!allTokensUnique} />
    </div>
  );
};

export default CreateRewardsFundPool;
