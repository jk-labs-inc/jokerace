import CustomLink from "@components/UI/Link";
import { ROUTE_VIEW_CONTEST_BASE_PATH } from "@config/routes";
import { ContestWithTotalRewards, ProcessedContest } from "lib/contests/types";
import { motion } from "motion/react";
import { FC } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import ContestLogo from "./components/Logo";
import ContestRewards from "./components/Rewards";
import ContestStatus from "./components/Status";
import ContesTitleAndAuthor from "./components/TitleAndAuthor";

interface ContestProps {
  contest: ProcessedContest | null;
  rewards: ContestWithTotalRewards | null;
  loading: boolean;
  rewardsLoading: boolean;
}

const Contest: FC<ContestProps> = ({ contest, loading, rewards, rewardsLoading }) => {
  if (!contest) return null;

  const getContestUrl = (contestAddress: string, contestNetworkName: string) => {
    if (!contestNetworkName || !contestAddress) return "";

    return ROUTE_VIEW_CONTEST_BASE_PATH.replace("[chain]", contestNetworkName).replace("[address]", contestAddress);
  };

  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
      <CustomLink to={getContestUrl(contest.address, contest.network_name)}>
        <motion.div
          className="flex flex-col items-start md:grid md:grid-cols-[60px_300px_auto_1fr] md:items-center gap-4 md:gap-8 py-4 md:py-6 px-2 md:px-4 border-t-primary-2 border-t"
          style={{ willChange: "transform" }}
          whileHover={{
            scale: 1.01,
            backgroundColor: "rgba(255, 255, 255, 0.03)",
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <ContestLogo chainName={contest.network_name} />
          <ContesTitleAndAuthor contestName={contest.title} contestAuthor={contest.author_address} />
          <ContestStatus contest={contest} />
          {rewards && rewards.hasRewards && rewards.rewardsData ? (
            <div className="md:justify-self-end">
              <ContestRewards rewards={rewards} loading={loading} rewardsLoading={rewardsLoading} />
            </div>
          ) : null}
        </motion.div>
      </CustomLink>
    </SkeletonTheme>
  );
};

export default Contest;
