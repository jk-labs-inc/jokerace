"use client";
import UserVotes from "@components/_pages/User/components/VotingList";
import { isSupabaseConfigured } from "@helpers/database";
import { useQuery } from "@tanstack/react-query";
import { ITEMS_PER_PAGE } from "lib/contests";
import { getUserVotes } from "lib/user";
import { SubmissionsResult } from "lib/user/types";
import { useState } from "react";

function useUserVotes(userAddress: string) {
  const [page, setPage] = useState(0);

  const {
    data: userVotesData,
    isError: isError,
    isFetching: isLoading,
  } = useQuery<SubmissionsResult>({
    queryKey: ["userVotes", userAddress, page],
    queryFn: () => {
      return getUserVotes(userAddress, page, ITEMS_PER_PAGE);
    },
    enabled: !!userAddress,
  });

  return {
    page,
    setPage,
    userVotesData,
    isError,
    isLoading,
  };
}

const UserVotesLayout = ({ address }: { address: string }) => {
  const { page, setPage, userVotesData, isLoading, isError } = useUserVotes(address);

  return (
    <>
      <UserVotes
        submissions={userVotesData}
        page={page}
        itemsPerPage={ITEMS_PER_PAGE}
        setPage={setPage}
        isError={isError}
        isLoading={isLoading}
      />
    </>
  );
};

export default UserVotesLayout;
