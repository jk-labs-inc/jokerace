import Explainer from "@components/Explainer";
import Subscribe from "@components/Subscribe";
import Button from "@components/UI/Button";
import ListContests from "@components/_pages/ListContests";
import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { isSupabaseConfigured } from "@helpers/database";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedContests, getRewards, ITEMS_PER_PAGE, searchContests } from "lib/contests";
import type { NextPage } from "next";
import Head from "next/head";
import router from "next/router";
import { useState } from "react";
import { useAccount } from "wagmi";

function useContests(initialData: any, searchValue: string) {
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  //@ts-ignore
  if (initialData?.data) queryOptions.initialData = initialData.data;

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery([searchValue ? "featuredContests" : "liveContests", page, address, searchValue], () =>
    searchValue
      ? searchContests(
          {
            searchString: searchValue,
            pagination: {
              currentPage: page,
            },
          },
          address,
        )
      : getFeaturedContests(page, 6, address),
  );

  const {
    status: rewardsStatus,
    data: rewardsData,
    error: rewardsError,
    isFetching: isRewardsFetching,
  } = useQuery(["rewards", contestData], data => getRewards(contestData?.data ?? []), {
    enabled: !!contestData,
  });

  return {
    page,
    setPage,
    status,
    contestData,
    rewardsData,
    isRewardsFetching,
    error,
    isContestDataFetching,
  };
}

const Page: NextPage = props => {
  const initialData = props;
  const [searchValue, setSearchValue] = useState("");
  const { isConnected } = useAccount();

  const {
    page,
    setPage,
    status,
    contestData,
    rewardsData,
    isRewardsFetching,
    error,
    isContestDataFetching,
    //@ts-ignore
  } = useContests(initialData?.data, searchValue);

  const onViewAll = () => {
    if (searchValue) {
      router.push(`/contests?title=${searchValue}`);
    } else {
      router.push(ROUTE_VIEW_LIVE_CONTESTS);
    }
  };

  return (
    <>
      <Head>
        <title>jokerace - contests for communities to make, execute, and reward decisions</title>
        <meta
          name="description"
          content="jokerace - contests for communities to make,
          execute, and reward decisions"
        />
      </Head>
      <div className="pl-8 pr-8 md:pl-16 md:pr-16 mt-4 md:mt-14 lg:mt-6 max-w-[1350px] 3xl:pl-28 2xl:pr-0 ">
        <div className="mb-8">
          <p className="hidden lg:flex text-[18px] md:text-[20px] font-bold">
            contests for communities to make, <br />
            execute, and reward decisions
          </p>
          <div className="flex items-center gap-5 text-[18px] font-bold lg:hidden">
            <Button intent={`${isConnected ? "primary" : "neutral-outline"}`} className="hidden xs:flex">
              Create contest
            </Button>
            <ConnectButton showBalance={false} accountStatus="full" label="Connect wallet" />
          </div>
        </div>

        <div className="hidden lg:full-width-grid-cols lg:gap-0">
          <div>
            <div className="text-[16px] font-bold  mb-1">stage one</div>
            <div className="h-1 bg-secondary-11"></div>
            <div className="text-[16px]  font-bold mt-1 text-secondary-11">creator asks a prompt</div>
          </div>
          <div>
            <div className="text-[16px] font-bold   mb-1">stage two</div>
            <div className="h-1 bg-primary-10"></div>
            <div className="text-[16px]  font-bold mt-1 text-primary-10">submitters respond</div>
          </div>
          <div>
            <div className="text-[16px] font-bold  mb-1">stage three</div>
            <div className="h-1 bg-positive-11"></div>
            <div className="text-[16px] font-bold mt-1 text-positive-11">voters pick top submissions</div>
          </div>
        </div>

        <div className="text-[16px] mt-14 -ml-[15px]">
          {isSupabaseConfigured ? (
            <div className="flex flex-col">
              <ListContests
                isFetching={isContestDataFetching}
                isRewardsFetching={isRewardsFetching}
                itemsPerPage={ITEMS_PER_PAGE}
                status={status}
                error={error}
                page={page}
                setPage={setPage}
                contestData={contestData}
                rewardsData={rewardsData}
                compact={true}
                onSearchChange={setSearchValue}
              />
              <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between mt-5">
                <Subscribe />
                <Button className="bg-primary-10 text-[18px] w-[146px] font-bold" onClick={onViewAll}>
                  View all
                </Button>
              </div>
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
      <Explainer />
    </>
  );
};

export default Page;
