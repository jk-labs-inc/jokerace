/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import Button from "@components/UI/Button";
import ListContests from "@components/_pages/ListContests";
import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { useQuery } from "@tanstack/react-query";
import { getLiveContests, ITEMS_PER_PAGE, searchContests } from "lib/contests";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

function useContests(initialData: any, searchValue: string) {
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  //@ts-ignore
  if (initialData?.data) queryOptions.initialData = initialData.data;

  const { status, data, error, isFetching, refetch } = useQuery(
    [searchValue ? "searchedContests" : "liveContests", page, address, searchValue],
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
        : getLiveContests(page, 4, address),
  );

  return {
    page,
    setPage,
    status,
    data,
    error,
    isFetching,
    refetch,
  };
}

const Page: NextPage = props => {
  const initialData = props;
  const [searchValue, setSearchValue] = useState("");

  const {
    page,
    setPage,
    status,
    data,
    error,
    isFetching,
    refetch,
    //@ts-ignore
  } = useContests(initialData?.data, searchValue);

  useEffect(() => {
    refetch();
  }, []);

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
      <div className="pl-8 pr-8 md:pl-16 md:pr-16 mt-6 max-w-[1350px] 2xl:pl-28 2xl:pr-0 ">
        <div className="mb-12 animate-fadeInLanding">
          <p className="text-[20px] md:text-[24px] font-bold">
            contests for communities to make, <br />
            execute, and reward decisions
          </p>
        </div>

        <div className="grid-cols-1 gap-3 md:full-width-grid-cols md:gap-0 animate-fadeInLanding">
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
            <div className="text-[16px] font-bold mt-1 text-positive-11">voters pick top submmissions</div>
          </div>
        </div>

        <div className="text-[16px] mt-6 -ml-[15px]">
          {process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
          process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
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
      <div className="pl-8 pr-8 md:pl-16 md:pr-16 mt-16 md:mt-32 gap-20 md:flex md:flex-col 2xl:pl-28 2xl:pr-0 2xl:flex-row animate-fadeInLanding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 2xl:grid-cols-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
              1
            </div>
            <p className="text-[24px] text-primary-10 font-bold">create a prompt</p>
            <ul className="list-disc list-inside text-[16px] font-bold list-explainer">
              <li>"submit a proposal"</li>
              <li>"design our new logo"</li>
              <li>"what features should we build?"</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
              2
            </div>
            <p className="text-[24px] text-primary-10 font-bold">pick who can submit</p>
            <ul className="list-disc list-inside text-[16px] font-bold list-explainer">
              <li>let anyone submit responses—</li>
              <li>or set requirements for who gets to respond.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
              3
            </div>
            <p className="text-[24px] text-primary-10 font-bold">pick who can vote</p>
            <ul className="list-disc list-inside text-[16px] font-bold list-explainer">
              <li>set requirements for who gets to vote</li>
              <li>pick how many votes they each get.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
              4
            </div>
            <p className="text-[24px] leading-5  text-primary-10 font-bold">
              <span className="text-[16px]">optional</span>
              <br />
              reward the winners
            </p>
            <ul className="list-disc list-inside text-[16px] font-bold list-explainer">
              <li>set a rewards pool to winners,</li>
              <li>decide what percent each rank gets</li>
              <li>invite others to fund the pool too</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-12 -ml-[45px] md:mt-0 md:ml-0 items-center">
          <div>
            <div className="bg-[url('/explainer/bg-1.svg')] bg-no-repeat pt-7 w-[520px] transform hover:scale-120 transition-transform duration-500">
              <p className="uppercase font-sabo text-[20px] text-center">
                grants,
                <br /> hackathons, awards <br /> bounties, remix contests
              </p>
              <div className="flex items-center flex-col mt-6">
                <div className="flex items-center gap-3">
                  <img src="/explainer/Ellipse5.svg" alt="donut" />
                  <img src="/explainer/Arrow2.svg" alt="donut" />
                  <p className="text-[16px] font-bold pt-12">
                    anyone submits (grants, <br />
                    projects, ideas, art, etc){" "}
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <img src="/explainer/Ellipse3.svg" alt="donut" className="-mt-[60px] -mr-[25px]" />
                  <img src="/explainer/Arrow3.svg" alt="donut" />
                  <p className="text-[16px] font-bold self-end">
                    jury votes <br /> on favorites{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[url('/explainer/bg-3.svg')] bg-no-repeat pt-32 w-[520px]  ml-8 transform hover:scale-120 transition-transform duration-500">
              <p className="uppercase font-sabo text-[20px] text-center">
                proposals, <br />
                budgets, drafts, <br />
                amendments
              </p>
              <div className="flex items-center flex-col mt-6">
                <div className="flex">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-[16px] font-bold">
                      a core team or creator submits <br />
                      (proposals, drafts of work, etc)
                    </p>
                    <img src="/explainer/Arrow1.svg" alt="donut" className="-rotate-[21deg]" />
                    <img src="/explainer/Ellipse1.svg" alt="donut" className="self-end" />
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-[16px] font-bold">
                      the community votes on <br /> which gets implemented
                    </p>
                    <img src="/explainer/Arrow4.svg" alt="donut" className="-rotate-[16deg]" />
                    <img src="/explainer/Ellipse2.svg" alt="donut" className="-mt-[60px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 bg-[url('/explainer/bg-2.svg')] bg-no-repeat w-[600px] bg-contain pt-[120px] pl-[100px] -ml-[100px]  transform hover:scale-120 transition-transform duration-500">
            <p className="uppercase font-sabo text-[20px] text-center">
              elections,
              <br /> feature requests, <br /> pulse checks, giveaways
            </p>
            <p className="text-[16px] font-bold text-center">
              your community submits (requests for <br />
              jobs, features, classes, content, etc) <br /> and then they vote on favorites
            </p>
            <img src="/explainer/Arrow5.svg" alt="donut" />
            <img src="/explainer/Ellipse4.svg" alt="donut" className="-mt-[60px]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
