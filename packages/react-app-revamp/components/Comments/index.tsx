/* eslint-disable react/no-unescaped-entities */
import useComments from "@hooks/useComments";
import { useCommentsStore } from "@hooks/useComments/store";
import { useReadContestState } from "@hooks/useContestState";
import { ContestStateEnum } from "@hooks/useContestState/store";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { Abi } from "viem";
import CommentsForm from "./components/Form";
import CommentsList from "./components/List";
interface CommentsProps {
  contestAddress: string;
  contestChainId: number;
  contestAbi: Abi;
  proposalId: string;
  numberOfComments: number | null;
  className?: string;
}

const Comments: FC<CommentsProps> = ({
  contestAddress,
  contestChainId,
  contestAbi,
  proposalId,
  numberOfComments,
  className,
}) => {
  const query = useSearchParams();
  const {
    state: contestState,
    isLoading: isLoadingContestState,
    isError: isErrorContestState,
  } = useReadContestState({
    contestAddress: contestAddress as `0x${string}`,
    contestChainId,
    contestAbi,
  });
  const isCompletedOrCanceled =
    isLoadingContestState || isErrorContestState
      ? true
      : contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
  const { getAllCommentsIdsPerProposal, getCommentsWithSpecificFirst, addComment, deleteComments, getCommentsPerPage } =
    useComments(contestAddress as `0x${string}`, contestChainId, proposalId);
  const {
    comments,
    isLoading,
    isDeleting,
    currentPage,
    isDeletingSuccess,
    totalPages,
    isPaginating,
    isAddingSuccess,
    isAdding,
  } = useCommentsStore(state => state);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query?.has("commentId")) {
      getCommentsWithSpecificFirst(query.get("commentId") ?? "");
      setTimeout(() => commentsRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
      return;
    }

    getAllCommentsIdsPerProposal();
  }, [proposalId, query]);

  const onLoadMoreComments = () => {
    const nextPage = currentPage + 1;
    getCommentsPerPage(nextPage);
  };

  return (
    <div className="flex justify-between flex-col w-full h-full" id="comments" ref={commentsRef}>
      {comments.length > 0 ? (
        <CommentsList
          className={className}
          comments={comments}
          isLoading={isLoading}
          isPaginating={isPaginating}
          isDeleting={isDeleting}
          isDeletingSuccess={isDeletingSuccess}
          currentPage={currentPage}
          totalPages={totalPages}
          onDeleteSelectedComments={selectedCommentsIds => deleteComments(selectedCommentsIds)}
          onLoadMoreComments={onLoadMoreComments}
          numberOfComments={numberOfComments}
        />
      ) : null}
      {!isCompletedOrCanceled ? (
        <div className="bg-neutral-1 mt-auto">
          <CommentsForm
            contestChainId={contestChainId}
            onSend={addComment}
            isAddingSuccess={isAddingSuccess}
            isAdding={isAdding}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Comments;
