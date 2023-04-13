/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import Button from "@components/UI/Button";
import ListContests from "@components/_pages/ListContests";
import { ROUTE_VIEW_LIVE_CONTESTS } from "@config/routes";
import { useQuery } from "@tanstack/react-query";
import { getLiveContests, ITEMS_PER_PAGE } from "lib/contests";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

function useContests(initialData: any) {
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  //@ts-ignore
  if (initialData?.data) queryOptions.initialData = initialData.data;

  const { status, data, error, isFetching, refetch } = useQuery(["liveContests", page, address], () =>
    getLiveContests(page, 4, address),
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
  const {
    page,
    setPage,
    status,
    data,
    error,
    isFetching,
    refetch,
    //@ts-ignore
  } = useContests(initialData?.data);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Head>
        <title>JokeDAO - open-source, collaborative decision-making platform</title>
        <meta name="description" content="JokeDAO is an open-source, collaborative decision-making platform." />
      </Head>
      <div className="pl-16 pr-16 mt-6 max-w-[1350px] 2xl:pl-28 2xl:pr-0">
        <div className="mb-12">
          <p className="text-[24px] font-bold">
            contests for communities to make, <br />
            execute, and reward decisions
          </p>
        </div>

        <div className="full-width-grid-cols gap-0">
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
          <Link href={ROUTE_VIEW_LIVE_CONTESTS}>
            <Button className="bg-primary-10 text-[18px] w-[146px] font-bold">View all</Button>
          </Link>
        </div>
      </div>
      <div className="flex pl-16 pr-16 2xl:pl-28 2xl:pr-0 gap-10 mt-32 ">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
              1
            </div>
            <p className="text-[24px] text-primary-10 font-bold">create a prompt</p>
            <ul className="list-disc list-inside text-[16px] font-bold">
              <li>"submit a new grant proposal"</li>
              <li>"design our new logo"</li>
              <li>"what features should we build?"</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
              2
            </div>
            <p className="text-[24px] text-primary-10 font-bold">pick who submits</p>
            <ul className="list-disc list-inside text-[16px] font-bold">
              <li>let anyone submit responses—</li>
              <li>or set requirements for who gets to respond.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
              3
            </div>
            <p className="text-[24px] text-primary-10 font-bold">pick who votes</p>
            <ul className="list-disc list-inside text-[16px] font-bold">
              <li>set requirements for who gets to vote</li>
              <li>pick how many votes they each get.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold text-[24px]">
              4
            </div>
            <p className="text-[24px] text-primary-10 font-bold">reward the winners</p>
            <ul className="list-disc list-inside text-[16px] font-bold">
              <li>set a rewards pool to winners,</li>
              <li>decide what percent each rank gets</li>
              <li>invite others to fund the pool too</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-row items-center">
          <div className="flex flex-col gap-6">
            <div className="p-10  borderTopLeftDotted">
              <p className="uppercase font-sabo text-[20px] text-center">
                grants,
                <br /> hackathons, <br /> bounties, music contests
              </p>
              <div className="flex items-center flex-col mt-6">
                <div className="flex items-center gap-3">
                  <img src="/explainer/first-slice/submission-ellipse.png" width={180} />
                  <img src="/explainer/arrow.png" width={50} height={35} />
                  <p className="text-[16px] font-bold">anyone submits (grants, projects, ideas, art, etc) </p>
                </div>
                <div className="flex items-center gap-5">
                  <img src="/explainer/first-slice/vote-ellipse.png" width={80} />
                  <img src="/explainer/arrow.png" width={30} height={35} />
                  <p className="text-[16px] font-bold">
                    jury votes <br /> on favorites{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-10  borderBottomLeftDotted">
              <p className="uppercase font-sabo text-[20px] text-center">
                proposals, <br />
                budgets, roadmaps
              </p>
              <div className="flex items-center flex-col mt-6">
                <div className="flex items-center gap-3">
                  <img src="/explainer/first-slice/submission-ellipse.png" width={180} />
                  <img src="/explainer/arrow.png" width={50} height={35} />
                  <p className="text-[16px] font-bold">anyone submits (grants, projects, ideas, art, etc) </p>
                </div>
                <div className="flex items-center gap-5">
                  <img src="/explainer/first-slice/vote-ellipse.png" width={80} />
                  <img src="/explainer/arrow.png" width={30} height={35} />
                  <p className="text-[16px] font-bold">
                    jury votes <br /> on favorites{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-10 gap-9  borderBottomRight">
            <p className="uppercase font-sabo text-[20px] text-center">
              elections,
              <br /> feature requests, <br /> pulse checks, giveaways
            </p>
            <p className="text-[16px] font-bold text-center">
              your community submits (requests for jobs, features, classes, content, etc) and then they vote on
              favorites
            </p>
            <img src="/explainer/arrow.png" width={50} className="rotate-[243deg]" />
            <img src="/explainer/last-slice/donut.png" width={200} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
