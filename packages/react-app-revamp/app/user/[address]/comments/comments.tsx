"use client";
import UserComments from "@components/_pages/User/components/CommentsList";
import { useQuery } from "@tanstack/react-query";
import { ITEMS_PER_PAGE } from "lib/contests";
import { getUserComments } from "lib/user";
import { CommentsResult } from "lib/user/types";
import { useState } from "react";

function useUserComments(userAddress: string) {
  const [page, setPage] = useState(0);

  const {
    data: userCommentsData,
    isError: isError,
    isFetching: isLoading,
  } = useQuery<CommentsResult>({
    queryKey: ["userComments", userAddress, page],
    queryFn: () => {
      return getUserComments(userAddress, page, ITEMS_PER_PAGE);
    },
    enabled: !!userAddress,
  });

  return {
    page,
    setPage,
    userCommentsData,
    isError,
    isLoading,
  };
}

const UserCommentsLayout = ({ address }: { address: string }) => {
  const { page, setPage, userCommentsData, isLoading, isError } = useUserComments(address);

  return (
    <>
      <UserComments
        comments={userCommentsData}
        page={page}
        itemsPerPage={ITEMS_PER_PAGE}
        setPage={setPage}
        isError={isError}
        isLoading={isLoading}
      />
    </>
  );
};

export default UserCommentsLayout;
