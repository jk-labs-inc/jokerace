import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useShallow } from "zustand/shallow";
import TokenWidgets from "./components/TokenWidgets";
import { useFundPoolStore } from "./store";

const CreateRewardsFundPool = () => {
  const addFundsToRewards = useDeployContestStore(useShallow(state => state.addFundsToRewards));
  const { isError, tokenWidgets } = useFundPoolStore(
    useShallow(state => ({
      isError: state.isError,
      tokenWidgets: state.tokenWidgets,
    })),
  );
  const allTokensUnique = tokenWidgets.length === new Set(tokenWidgets.map(token => token.address)).size;
  const hasZeroAmountToken = tokenWidgets.some(token => token.amount === "0" || token.amount === "");

  const isDisabled =
    (addFundsToRewards && (tokenWidgets.length === 0 || hasZeroAmountToken)) || isError || !allTokensUnique;

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-8">{addFundsToRewards && <TokenWidgets />}</div>
    </div>
  );
};

export default CreateRewardsFundPool;
