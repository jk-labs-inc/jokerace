import { FC } from "react";
import InfoPanel from "../../InfoPanel";
import { ModuleType } from "lib/rewards/types";

interface RewardsNotStartedProps {
  rewardsType: ModuleType;
}

const RewardsNotStarted: FC<RewardsNotStartedProps> = ({ rewardsType }) => {
  const isVoterRewards = rewardsType === ModuleType.VOTER_REWARDS;
  const description = isVoterRewards ? (
    <p className="text-[16px] text-neutral-11">
      {" "}
      come back when voting opens to qualify <br />
      for rewards.
    </p>
  ) : (
    <p className="text-[16px] text-neutral-11">
      you’ve entered this contest! come back <br />
      when voting opens to see your rewards.
    </p>
  );

  return (
    <InfoPanel
      title="my rewards"
      image="/rewards/voters-voting-not-started.png"
      imageAlt="voting not started"
      heading="get ready!"
      description={description}
    />
  );
};

export default RewardsNotStarted;
