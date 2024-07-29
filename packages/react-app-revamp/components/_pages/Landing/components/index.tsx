import FeaturedContests from "@components/_pages/FeaturedContests";
import { ROUTE_CREATE_CONTEST, ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { isSupabaseConfigured } from "@helpers/database";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedContests, getRewards } from "lib/contests";
import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { TypeAnimation } from "react-type-animation";
import LandingPageExplainer from "./Explainer";
import LandingPageUsedBy from "./UsedBy";

const wordConfig = {
  desktop: [
    "hackathons",
    "grants rounds",
    "awards",
    "applications",
    "demo days",
    "talent communities",
    "art contests",
    "debates",
    "reality tv shows",
  ],
  mobile: [
    "hackathons",
    "grants",
    "awards",
    "applications",
    "demo days",
    "leaderboards",
    "art contests",
    "debates",
    "game shows",
  ],
};

function useFeaturedContests() {
  const [page] = useState(0);

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery({
    queryKey: ["featuredContests", page],
    queryFn: () => getFeaturedContests(page, 6),
    refetchOnWindowFocus: false,
  });

  const { data: rewardsData, isFetching: isRewardsFetching } = useQuery({
    queryKey: ["rewards", contestData],
    queryFn: () => getRewards(contestData?.data ?? []),
    enabled: !!contestData,
    refetchOnWindowFocus: false,
  });

  return {
    status,
    contestData,
    rewardsData,
    isRewardsFetching,
    error,
    isContestDataFetching,
  };
}

const LandingPage = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const words = isMobile ? wordConfig.mobile : wordConfig.desktop;
  const { status, contestData, rewardsData, isRewardsFetching, isContestDataFetching } = useFeaturedContests();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 pl-4 pr-4 md:pl-16 md:pr-16 lg:mt-6 3xl:pl-28 2xl:pr-0 ">
        <div className="flex flex-col">
          <p className="text-[32px] md:text-[48px] font-bold">
            contests for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-purple inline-block">
              <TypeAnimation
                sequence={words.flatMap(word => [word, 2000, "", 100])}
                wrapper="span"
                speed={50}
                style={{ display: "inline-block" }}
                repeat={Infinity}
              />
            </span>
          </p>
          <p className="text-[16px] md:text-[24px] font-bold">for communities to grow, run, and monetize</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 bg-gradient-fade-black-purple">
        <div className="pl-4 pr-4 md:pl-16 md:pr-16 3xl:pl-28 2xl:pr-0 ">
          <Link
            href={ROUTE_CREATE_CONTEST}
            className="bg-gradient-green w-[300px] md:w-[320px] h-10 md:h-12 rounded-[40px] text-[20px] font-bold text-true-black text-center flex items-center justify-center transition-all duration-300 hover:opacity-90"
          >
            <span className="flex items-center normal-case">
              Create a Contest in Seconds
              <ChevronRightIcon className="w-6 h-6 ml-2 text-true-black font-bold" />
            </span>
          </Link>
        </div>

        <div className="pl-4 pr-4 md:pl-16 md:pr-16 3xl:pl-28 2xl:pr-0 mt-4">
          {isSupabaseConfigured ? (
            <div className="flex flex-col gap-8 w-full">
              <FeaturedContests
                status={status}
                contestData={contestData}
                rewardsData={rewardsData}
                isContestDataFetching={isContestDataFetching}
                isRewardsFetching={isRewardsFetching}
              />
              <Link href={ROUTE_VIEW_LIVE_CONTESTS} className="flex gap-1 items-center">
                <p className="text-[16px] md:text-[18px] text-positive-11 font-bold hover:text-positive-10 transition-colors duration-300 ease-in-out">
                  view all contests
                </p>
                <ChevronRightIcon className="w-4 h-4 text-positive-11 font-bold" />
              </Link>
            </div>
          ) : (
            <div className="border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold">
              This site&apos;s current deployment does not have access to jokerace&apos;s reference database of
              contests, but you can check out our Supabase backups{" "}
              <a
                className="link px-1ex"
                href="https://github.com/jk-labs-inc/jokerace/tree/staging/packages/supabase"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>{" "}
              for contest chain and address information!
            </div>
          )}
        </div>
      </div>
      <LandingPageUsedBy />
      <LandingPageExplainer />
    </div>
  );
};

export default LandingPage;
