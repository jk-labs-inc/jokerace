import { RewardPoolType, useCreateRewardsStore } from "../../../../store";
import { useShallow } from "zustand/shallow";

const RewardsTypeInfoVoters = () => {
  return (
    <div className="absolute inset-0 flex flex-col gap-4">
      <p className="text-neutral-11 text-[16px]">
        let's pick how to fund a rewards pool for <b>voters—</b>then <br />
        decide on the proportions that everyone gets.
      </p>
      <p className="text-neutral-11 text-[16px]">
        in this case, anyone with <span className="normal-case">US</span>-based <span className="normal-case">IP</span>{" "}
        addresses will be <br />
        geoblocked from voting.
      </p>
    </div>
  );
};

const RewardsTypeInfoWinners = () => {
  return (
    <div className="absolute inset-0 flex flex-col gap-4">
      <p className="text-neutral-11 text-[16px]">
        let's pick how to fund a rewards pool for <b>winners-</b>then <br />
        decide on the proportions that everyone gets.
      </p>
      <p className="text-neutral-11 text-[16px]">in this case, nobody will be geoblocked from voting.</p>
    </div>
  );
};

const RewardsTypeInfo = () => {
  const rewardPoolType = useCreateRewardsStore(useShallow(state => state.rewardPoolType));

  return (
    <div className="relative h-[120px]">
      {rewardPoolType === RewardPoolType.Voters ? <RewardsTypeInfoVoters /> : <RewardsTypeInfoWinners />}
    </div>
  );
};

export default RewardsTypeInfo;
