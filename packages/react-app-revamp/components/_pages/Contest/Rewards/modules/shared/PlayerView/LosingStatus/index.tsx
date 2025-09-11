import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import Link from "next/link";
import { FC } from "react";
import InfoPanel from "../../InfoPanel";

interface RewardsPlayerLosingStatusProps {
  phase: "active" | "closed";
}

const RewardsPlayerLosingStatus: FC<RewardsPlayerLosingStatusProps> = ({ phase }) => {
  const content = {
    active: {
      heading: "no rewards... yet!",
      image: "/rewards/rewards-losing.png",
      description: (
        <p className="text-[16px] text-neutral-11">
          <b>but there’s still time.</b> vote more on your favorite entries, or vote on other ones to win!
        </p>
      ),
    },
    closed: {
      heading: "no rewards... this time!",
      image: "/rewards/not-qualified-end-phase.png",
      description: (
        <p className="text-[16px] text-neutral-11">
          play in{" "}
          <Link className="text-positive-11" href={ROUTE_VIEW_LIVE_CONTESTS}>
            more contests
          </Link>{" "}
          for more chances <br />
          to earn!
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

export default RewardsPlayerLosingStatus;
