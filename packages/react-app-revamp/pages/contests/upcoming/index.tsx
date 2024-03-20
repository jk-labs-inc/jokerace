import ListContests from "@components/_pages/ListContests";
import { isSupabaseConfigured } from "@helpers/database";
import getPagination from "@helpers/getPagination";
import useContestSortOptions from "@hooks/useSortOptions";
import { getLayout } from "@layouts/LayoutContests";
import { useQuery } from "@tanstack/react-query";
import { getRewards, getUpcomingContests, ITEMS_PER_PAGE } from "lib/contests";
import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAccount } from "wagmi";

function useContests(sortBy?: string) {
  const [page, setPage] = useState(0);
  const { address } = useAccount();
  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery({
    queryKey: ["upcomingContests", page, address, sortBy],
    queryFn: () => getUpcomingContests(page, ITEMS_PER_PAGE, address, sortBy),
  });

  const { data: rewardsData, isFetching: isRewardsFetching } = useQuery({
    queryKey: ["rewards", contestData],
    queryFn: () => getRewards(contestData?.data ?? []),
    enabled: !!contestData,
  });

  return {
    page,
    setPage,
    status,
    contestData,
    rewardsData,
    error,
    isContestDataFetching,
    isRewardsFetching,
  };
}
const Page: NextPage = () => {
  const [sortBy, setSortBy] = useState<string>("");
  const sortOptions = useContestSortOptions("upcomingContests");
  const { page, setPage, status, contestData, rewardsData, error, isContestDataFetching, isRewardsFetching } =
    useContests(sortBy);

  return (
    <>
      <Head>
        <title>Upcoming contests - jokerace</title>
        <meta name="description" content="Upcoming contests on jokerace." />
      </Head>

      <div className="container mx-auto pt-10">
        <h1 className="sr-only">Upcoming contests</h1>
        {isSupabaseConfigured ? (
          <ListContests
            isContestDataFetching={isContestDataFetching}
            isRewardsFetching={isRewardsFetching}
            itemsPerPage={ITEMS_PER_PAGE}
            status={status}
            error={error}
            page={page}
            setPage={setPage}
            contestData={contestData}
            rewardsData={rewardsData}
            sortOptions={sortOptions}
            onSortChange={setSortBy}
          />
        ) : (
          <div className="border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold">
            This site&apos;s current deployment does not have access to jokerace&apos;s reference database of contests,
            but you can check out our Supabase backups{" "}
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
        )}{" "}
      </div>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const cookie = req?.headers.cookie || "";

  return {
    props: {
      cookie,
    },
  };
};

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
