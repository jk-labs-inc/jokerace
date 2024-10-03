"use client";
import UserSubmissions from "@components/_pages/User/components/SubmissionsList";
import { useQuery } from "@tanstack/react-query";
import { ITEMS_PER_PAGE } from "lib/contests";
import { getUserSubmissions } from "lib/user";
import { SubmissionsResult } from "lib/user/types";
import { useState } from "react";

function useUserSubmissions(userAddress: string) {
  const [page, setPage] = useState(0);

  const {
    data: userSubmissionsData,
    isError: isError,
    isFetching: isLoading,
  } = useQuery<SubmissionsResult>({
    queryKey: ["userSubmissions", userAddress, page],
    queryFn: () => {
      return getUserSubmissions(userAddress, page, ITEMS_PER_PAGE);
    },
    enabled: !!userAddress,
  });

  return {
    page,
    setPage,
    userSubmissionsData,
    isError,
    isLoading,
  };
}

const UserSubmissionsLayout = ({ address }: { address: string }) => {
  const { page, setPage, userSubmissionsData, isLoading, isError } = useUserSubmissions(address);

  return (
    <UserSubmissions
      submissions={userSubmissionsData}
      page={page}
      itemsPerPage={ITEMS_PER_PAGE}
      setPage={setPage}
      isError={isError}
      isLoading={isLoading}
    />
  );
};

export default UserSubmissionsLayout;
