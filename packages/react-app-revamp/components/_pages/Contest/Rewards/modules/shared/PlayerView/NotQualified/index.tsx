import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import Link from "next/link";
import { FC } from "react";
import InfoPanel from "../../InfoPanel";

interface RewardsPlayerNotQualifiedProps {
  phase: "active" | "closed";
}

const RewardsPlayerNotQualified: FC<RewardsPlayerNotQualifiedProps> = ({ phase }) => {
  const content = {
    active: {
      heading: "hurry!",
      image: "/rewards/not-qualified-in-play-phase.png",
      description: (
        <p className="text-[16px] text-neutral-11">
          <b>you need to vote</b> in order to qualify for <br />
          rewards!
        </p>
      ),
    },
    closed: {
      heading: "no rewards... yet!",
      image: "/rewards/not-qualified-end-phase.png",
      description: (
        <p className="text-[16px] text-neutral-11">
          you didn't play in this one, but play in <br />
          <Link className="text-positive-11" href={ROUTE_VIEW_LIVE_CONTESTS}>
            more contests
          </Link>{" "}
          for more chances to earn!
        </p>
      ),
    },
  };

  const phaseContent = content[phase];

  return (
    <InfoPanel
      title="my rewards"
      image={phaseContent.image}
      imageAlt=""
      heading={phaseContent.heading}
      description={phaseContent.description}
    />
  );
};

export default RewardsPlayerNotQualified;
