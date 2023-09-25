import { getAddressProps } from "@helpers/getAddressProps";
import LayoutUser from "@layouts/LayoutUser";
import { useQuery } from "@tanstack/react-query";
import { ITEMS_PER_PAGE } from "lib/contests";
import { getUserSubmissions } from "lib/user";
import { FC, useState } from "react";
import { UserPageProps } from "..";

function useUserSubmissions(userAddress: string) {
  const [page, setPage] = useState(0);
  const queryOptions = {
    keepPreviousData: true,
    staleTime: 5000,
  };

  const {
    status,
    data: userSubmissionsData,
    isError: isError,
    isSuccess: isSuccess,
    isFetching: isLoading,
  } = useQuery(
    ["searchedContests", userAddress, page],
    () => {
      return getUserSubmissions(userAddress, page, ITEMS_PER_PAGE);
    },
    {
      ...queryOptions,
      enabled: !!userAddress,
    },
  );

  return {
    page,
    setPage,
    status,
    userSubmissionsData,
    isError,
    isLoading,
    isSuccess,
  };
}

const Page: FC<UserPageProps> = ({ address }) => {
  const { page, setPage, status, userSubmissionsData } = useUserSubmissions(address);

  console.log({ userSubmissionsData });
  return <LayoutUser address={address}>submissions</LayoutUser>;
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
