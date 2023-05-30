import Explainer from "@components/Explainer";
import Button from "@components/UI/Button";
import ListContests from "@components/_pages/ListContests";
import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { isSupabaseConfigured } from "@helpers/database";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedContests, ITEMS_PER_PAGE, searchContests } from "lib/contests";
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

  const { status, data, error, isFetching } = useQuery(
    [searchValue ? "featuredContests" : "liveContests", page, address, searchValue],
    () =>
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
        : getFeaturedContests(page, 4, address),
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
  const [searchValue, setSearchValue] = useState("");
  const { isConnected } = useAccount();

  const {
    page,
    setPage,
    status,
    data,
    error,
    isFetching,
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
        <title>JokeDAO - open-source, collaborative decision-making platform</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
      <div className="pl-8 pr-8 md:pl-16 md:pr-16 mt-4 md:mt-14 lg:mt-6 max-w-[1350px] 3xl:pl-28 2xl:pr-0 ">
        <div className="mb-12 animate-fadeInLanding">
          <p className="hidden lg:flex text-[18px] md:text-[24px] font-bold">
            contests for communities to make, <br />
            execute, and reward decisions
          </p>
          <div className="flex items-center gap-5 text-[18px] font-bold lg:hidden">
            <Button intent={`${isConnected ? "primary" : "neutral-outline"}`} className="hidden xs:flex">
              Create contest
            </Button>
            <ConnectButton showBalance={false} accountStatus="address" label="Connect wallet" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:full-width-grid-cols md:gap-0 animate-fadeInLanding">
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
            <ListContests
              isFetching={isFetching}
              itemsPerPage={ITEMS_PER_PAGE}
              status={status}
              error={error}
              page={page}
              setPage={setPage}
              result={data}
              compact={true}
              onSearchChange={setSearchValue}
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
          )}
        </div>
        <div className="flex justify-end mt-5">
          <Button className="bg-primary-10 text-[18px] w-[146px] font-bold" onClick={onViewAll}>
            View all
          </Button>
        </div>
      </div>
      <Explainer />
    </>
  );
};

export default Page;
