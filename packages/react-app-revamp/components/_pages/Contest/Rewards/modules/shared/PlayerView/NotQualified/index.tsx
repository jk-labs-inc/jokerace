import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { ModuleType } from "lib/rewards";
import Link from "next/link";
import { FC } from "react";
import InfoPanel from "../../InfoPanel";

interface RewardsPlayerNotQualifiedProps {
  phase: "active" | "closed";
  rewardsType: ModuleType;
}

const RewardsPlayerNotQualified: FC<RewardsPlayerNotQualifiedProps> = ({ rewardsType, phase }) => {
  const isVoterRewards = rewardsType === ModuleType.VOTER_REWARDS;

  const content = {
    active: {
      heading: "hurry!",
      image: "/rewards/not-qualified-in-play-phase.png",
      voterDescription: (
        <p className="text-[16px] text-neutral-11">
          <b>you need to vote</b> in order to qualify for rewards!
        </p>
      ),
      contestantDescription: (
        <p className="text-[16px] text-neutral-11">
          <b>you need to enter the contest</b> in order to qualify for rewards!
        </p>
      ),
    },
    closed: {
      heading: "no rewards... yet!",
      image: "/rewards/not-qualified-end-phase.png",
      voterDescription: (
        <p className="text-[16px] text-neutral-11">
          you didn't play in this one, but play in <br />
          <Link className="text-positive-11" href={ROUTE_VIEW_LIVE_CONTESTS}>
            more contests
          </Link>{" "}
          for more chances to earn!
        </p>
      ),
      contestantDescription: (
        <p className="text-[16px] text-neutral-11">
          you didn't enter this one, but play in <br />
          <Link className="text-positive-11" href={ROUTE_VIEW_LIVE_CONTESTS}>
            more contests
          </Link>{" "}
          for more chances to earn!
        </p>
      ),
    },
  };

  const phaseContent = content[phase];
  const description = isVoterRewards ? phaseContent.voterDescription : phaseContent.contestantDescription;

  return (
    <InfoPanel
      title="my rewards"
      image={phaseContent.image}
      imageAlt=""
      heading={phaseContent.heading}
      description={description}
    />
  );
};

export default RewardsPlayerNotQualified;
