import ListContests from "@components/_pages/ListContests";
import { isSupabaseConfigured } from "@helpers/database";
import { getAddressProps } from "@helpers/getAddressProps";
import LayoutUser from "@layouts/LayoutUser";
import { useQuery } from "@tanstack/react-query";
import { getRewards, getUserContests, ITEMS_PER_PAGE } from "lib/contests";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useAccount } from "wagmi";

export interface UserPageProps {
  address: string;
  initialData: any;
  ensName: string;
}

function useContests(profileAddress: string, currentUserAddress: string, initialData: any) {
  const [page, setPage] = useState(0);

  //@ts-ignore
  if (initialData?.data) queryOptions.initialData = initialData.data;

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery(
    ["userContests", profileAddress, page, currentUserAddress],
    () => {
      return getUserContests(page, ITEMS_PER_PAGE, profileAddress, currentUserAddress);
    },
    {
      enabled: !!profileAddress,
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
const Page: NextPage = (props: UserPageProps) => {
  const { address, ensName, initialData } = props;
  const { address: currentUserAddress } = useAccount();
  const { page, setPage, status, contestData, rewardsData, isRewardsFetching, error, isContestDataFetching } =
    useContests(address, currentUserAddress as string, initialData?.data);
  const isCreator = currentUserAddress === address;

  return (
    <LayoutUser address={address}>
      <Head>
        <title>{ensName || address} - jokerace</title>
      </Head>

      {isSupabaseConfigured ? (
        <div className="container mx-auto mt-4">
          <ListContests
            isContestDataFetching={isContestDataFetching}
            itemsPerPage={ITEMS_PER_PAGE}
            status={status}
            error={error}
            page={page}
            setPage={setPage}
            allowToHide={isCreator}
            contestData={contestData}
            rewardsData={rewardsData}
            isRewardsFetching={isRewardsFetching}
          />
        </div>
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
      )}
    </LayoutUser>
  );
};

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }: any) {
  const { address: pathAddress } = params;

  const addressProps = await getAddressProps(pathAddress);

  if (addressProps.notFound) {
    return { notFound: true };
  }

  return {
    props: addressProps,
  };
}

export default Page;
