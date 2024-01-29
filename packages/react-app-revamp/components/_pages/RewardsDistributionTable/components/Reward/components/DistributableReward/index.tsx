import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import Loader from "@components/UI/Loader";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import Skeleton from "react-loading-skeleton";
import { Tooltip } from "react-tooltip";

interface DistributableRewardProps {
  queryTokenBalance: any;
  rewardsReleasable: number;
  isReleasableRewardsLoading: boolean;
  isDistributeRewardsLoading: boolean;
  handleDistributeRewards?: () => Promise<void>;
}

export const DistributableReward = (props: DistributableRewardProps) => {
  const { contestStatus } = useContestStatusStore(state => state);
  const {
    queryTokenBalance,
    rewardsReleasable,
    handleDistributeRewards,
    isDistributeRewardsLoading,
    isReleasableRewardsLoading,
  } = props;

  if (queryTokenBalance.isLoading)
    return (
      <li className="flex items-center">
        <Skeleton width={200} height={16} />
      </li>
    );

  if (!rewardsReleasable || queryTokenBalance.data.value.toString() === "0") {
    return (
      <li>
        <span className="uppercase">${queryTokenBalance?.data?.symbol}</span> — no funds to distribute
      </li>
    );
  }

  return (
    <li className="flex items-center">
      <section className="flex justify-between w-full">
        {isReleasableRewardsLoading && <Loader scale="component">Loading info...</Loader>}
        <p>
          {rewardsReleasable} <span className="uppercase">${queryTokenBalance?.data?.symbol}</span>
        </p>

        {/* //TODO: check previous code here */}
        <div data-tooltip-id={`tooltip-${queryTokenBalance?.data?.symbol}`}>
          {rewardsReleasable > 0 && (
            <ButtonV3
              isDisabled={contestStatus !== ContestStatus.VotingClosed || isDistributeRewardsLoading}
              size={ButtonSize.EXTRA_SMALL}
              colorClass="bg-gradient-distribute"
              onClick={handleDistributeRewards}
            >
              distribute
            </ButtonV3>
          )}
        </div>
        {contestStatus !== ContestStatus.VotingClosed && (
          <Tooltip id={`tooltip-${queryTokenBalance?.data?.symbol}`}>
            <p className="text-[16px]">funds cannot be distributed until voting has ended!</p>
          </Tooltip>
        )}
      </section>
    </li>
  );
};
