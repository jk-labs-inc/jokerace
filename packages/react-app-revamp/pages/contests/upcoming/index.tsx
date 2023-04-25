import Head from "next/head";
import { getLayout } from "@layouts/LayoutContests";
import type { NextPage } from "next";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getPagination from "@helpers/getPagination";
import ListContests from "@components/_pages/ListContests";
import { getUpcomingContests, ITEMS_PER_PAGE } from "lib/contests";
import { isSupabaseConfigured } from "@helpers/database";

function useContests(initialData: any) {
  const [page, setPage] = useState(0);

  const queryOptions = {
    keepPreviousData: true,
    staleTime: 5000,
  };

  //@ts-ignore
  if (initialData?.data) queryOptions.initialData = initialData.data;

  const { status, data, error, isFetching } = useQuery(
    ["upcomingContests", page],
    () => getUpcomingContests(page, ITEMS_PER_PAGE),
    queryOptions,
  );

  return {
    page,
    setPage,
    status,
    data,
    error,
    isFetching,
  };
}
const Page: NextPage = props => {
  const initialData = props;
  const {
    page,
    setPage,
    status,
    data,
    error,
    isFetching,
    //@ts-ignore
  } = useContests(initialData?.data);

  return (
    <>
      <Head>
        <title>Upcoming contests - JokeDAO</title>
        <meta name="description" content="Upcoming contests on JokeDAO." />
      </Head>

      <div className="container mx-auto pt-10">
        <h1 className="sr-only">Upcoming contests</h1>
        {isSupabaseConfigured ? (
          <ListContests
            isFetching={isFetching}
            itemsPerPage={ITEMS_PER_PAGE}
            status={status}
            error={error}
            page={page}
            setPage={setPage}
            result={data}
          />
        ) : (
          <div className="border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold">
            This site&apos;s current deployment does not have access to jokedao&apos;s reference database of contests,
              but you can check out our Supabase backups{" "}
              <a
                className="link px-1ex"
                href="https://github.com/JokeDAO/JokeDaoV2Dev/tree/staging/packages/supabase"
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

export async function getStaticProps() {
  if (isSupabaseConfigured) {
    const config = await import("@config/supabase");
    const supabase = config.supabase;
    const { from, to } = getPagination(0, 7);

    const result = await supabase
      .from("contests")
      .select("*", { count: "exact" })
      // all rows whose submissions start date is > to the current date.
      .gt("start_at", new Date().toISOString())
      .order("start_at", { ascending: false })
      .range(from, to);
    const { data, error } = result;

    if (error) {
      return {
        props: {},
        revalidate: 60,
      };
    }
    return {
      props: {
        data,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every 60 seconds
      revalidate: 60, // In seconds
    };
  }
  return {
    props: {
      data: [],
    },
  };
}

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
