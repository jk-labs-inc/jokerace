import { useMediaQuery } from "react-responsive";
import { RewardPoolType, useCreateRewardsStore } from "../../../../store";
import { useShallow } from "zustand/shallow";

const RewardsTypeInfoVoters = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-11 text-[16px]">
        let's pick how to fund a rewards pool for <b>voters—</b>then {isMobile ? "" : <br />}
        decide on the proportions that everyone gets.
      </p>
    </div>
  );
};

const RewardsTypeInfoWinners = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-11 text-[16px]">
        let's pick how to fund a rewards pool for <b>contestants—</b>then {isMobile ? "" : <br />}
        decide on the proportions that everyone gets.
      </p>
    </div>
  );
};

const RewardsTypeInfo = () => {
  const rewardPoolType = useCreateRewardsStore(useShallow(state => state.rewardPoolType));

  return <div>{rewardPoolType === RewardPoolType.Voters ? <RewardsTypeInfoVoters /> : <RewardsTypeInfoWinners />}</div>;
};

export default RewardsTypeInfo;
