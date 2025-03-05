import { useContestStore } from "@hooks/useContest/store";
import CreateRewardsNavigation from "../../components/Buttons/Navigation";
import { useCreateRewardsStore } from "../../store";
import TokenWidgets from "./components/TokenWidgets";
import { useFundPoolStore } from "./store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import CreateRewardsAddEarningsToggle from "../ReviewPool/components/AddEarnings";
import CreateRewardsAddFundsToggle from "../ReviewPool/components/AddFunds";
import { useMediaQuery } from "react-responsive";

const CreateRewardsFundPool = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const charge = useContestStore(state => state.charge);
  const contestState = useContestStateStore(state => state.contestState);
  const isContestFinishedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
  const enableEarningsToggle = charge && charge.percentageToCreator > 0 && !isContestFinishedOrCanceled;
  const { currentStep, addFundsToRewards, addEarningsToRewards } = useCreateRewardsStore(state => state);
  const { isError, tokenWidgets } = useFundPoolStore(state => state);
  const allTokensUnique = tokenWidgets.length === new Set(tokenWidgets.map(token => token.address)).size;
  const hasZeroAmountToken = tokenWidgets.some(token => token.amount === "0" || token.amount === "");

  const isNavigationDisabled =
    (!addEarningsToRewards && !addFundsToRewards) ||
    (addFundsToRewards && (tokenWidgets.length === 0 || hasZeroAmountToken)) ||
    isError ||
    !allTokensUnique;

  return (
    <div className="flex flex-col gap-12 animate-swingInLeft">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">rewards for winners 🤑</p>
        <p className="text-[16px] text-neutral-11">
          {isMobile ? "" : "now"} let's create a rewards pool to reward winners.
        </p>
        <p className="text-[16px] text-neutral-11">
          first, let's pick how to fund it—then decide on the <br />
          proportions that everyone gets.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {enableEarningsToggle && <CreateRewardsAddEarningsToggle />}
        <CreateRewardsAddFundsToggle />

        {addFundsToRewards && <TokenWidgets />}
      </div>

      <CreateRewardsNavigation step={currentStep} isDisabled={isNavigationDisabled} isError={!allTokensUnique} />
    </div>
  );
};

export default CreateRewardsFundPool;
