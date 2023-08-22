/* eslint-disable @next/next/no-img-element */
import EthereumAddress from "@components/UI/EtheuremAddress";
import ListContests from "@components/_pages/ListContests";
import { isSupabaseConfigured } from "@helpers/database";
import { getLayout } from "@layouts/LayoutCreator";
import { useQuery } from "@tanstack/react-query";
import { fetchEnsAddress, fetchEnsName } from "@wagmi/core";
import { getRewards, ITEMS_PER_PAGE, searchContests } from "lib/contests";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface PageProps {
  address: string;
  initialData: any;
  ensName: string;
  avatar: any;
}

function useContests(creatorAddress: string, initialData: any) {
  const [page, setPage] = useState(0);
  const queryOptions = {
    keepPreviousData: true,
    staleTime: 5000,
  };

  //@ts-ignore
  if (initialData?.data) queryOptions.initialData = initialData.data;

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery(
    ["searchedContests", creatorAddress, page],
    () => {
      return searchContests(
        {
          searchString: creatorAddress,
          searchColumn: "author_address",
          pagination: {
            currentPage: page,
          },
        },
        creatorAddress,
      );
    },
    {
      ...queryOptions,
      enabled: !!creatorAddress,
    },
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

//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { address, ensName, initialData } = props;
  const { page, setPage, status, contestData, rewardsData, isRewardsFetching, error, isContestDataFetching } =
    useContests(address, initialData?.data);

  return (
    <>
      <Head>
        <title>{ensName || address} - jokerace</title>
        <meta name="description" content="@TODO: change this" />
      </Head>
      <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
        <div className="container mx-auto mt-12">
          {!address ? (
            <div className="flex items-center gap-6">
              <Skeleton circle height={100} width={100} />
              <Skeleton height={24} width={200} />
            </div>
          ) : (
            <EthereumAddress ethereumAddress={address} shortenOnFallback isLarge />
          )}
          <div className="flex items-center gap-8 mb-8"></div>

          {isSupabaseConfigured ? (
            <ListContests
              isContestDataFetching={isContestDataFetching}
              itemsPerPage={ITEMS_PER_PAGE}
              status={status}
              error={error}
              page={page}
              setPage={setPage}
              contestData={contestData}
              rewardsData={rewardsData}
              isRewardsFetching={isRewardsFetching}
            />
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
      </SkeletonTheme>
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }: any) {
  const { address: pathAddress } = params;

  let actualAddress = pathAddress;
  let ensName: string | null = null;

  if (pathAddress.endsWith(".eth")) {
    try {
      const resolvedAddress = await fetchEnsAddress({
        name: pathAddress,
        chainId: 1,
      });

      if (resolvedAddress) {
        actualAddress = resolvedAddress;
      } else {
        return { notFound: true };
      }
    } catch (error) {
      console.error("Error resolving ENS address:", error);
      return { notFound: true };
    }
  } else if (!REGEX_ETHEREUM_ADDRESS.test(pathAddress)) {
    return { notFound: true };
  }

  // If it's not an ENS name and is a valid Ethereum address, get the ENS name for it
  if (actualAddress !== pathAddress) {
    try {
      const fetchedEnsName = await fetchEnsName({
        address: actualAddress as `0x${string}`,
        chainId: 1,
      });

      if (fetchedEnsName) {
        ensName = fetchedEnsName;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    props: {
      address: actualAddress,
      ensName: ensName || actualAddress,
    },
  };
}

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
