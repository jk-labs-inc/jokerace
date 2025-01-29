/* eslint-disable react/no-unescaped-entities */
import useComments from "@hooks/useComments";
import { useCommentsStore } from "@hooks/useComments/store";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import CommentsForm from "./components/Form";
import CommentsList from "./components/List";
import { useContestStatusStore } from "@hooks/useContestStatus/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";

interface CommentsProps {
  contestAddress: string;
  contestChainId: number;
  proposalId: string;
  numberOfComments: number | null;
}

const Comments: FC<CommentsProps> = ({ contestAddress, contestChainId, proposalId, numberOfComments }) => {
  const query = useSearchParams();
  const contestState = useContestStateStore(state => state.contestState);
  const isCompletedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
  const { getAllCommentsIdsPerProposal, getCommentsWithSpecificFirst, addComment, deleteComments, getCommentsPerPage } =
    useComments(contestAddress, contestChainId, proposalId);
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
