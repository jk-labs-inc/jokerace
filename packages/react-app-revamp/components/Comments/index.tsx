import useComments from "@hooks/useComments";
import { useCommentsStore } from "@hooks/useComments/store";
import { ContestStateEnum } from "@hooks/useContestState/store";
import { useSearch } from "@tanstack/react-router";
import { FC, useEffect, useRef } from "react";
import CommentsForm from "./components/Form";
import CommentsList from "./components/List";

interface CommentsProps {
  contestAddress: string;
  contestChainId: number;
  contestAuthor: string;
  proposalId: string;
  numberOfComments: number | null;
  contestState: ContestStateEnum | null;
  className?: string;
}

const Comments: FC<CommentsProps> = ({
  contestAddress,
  contestChainId,
  contestState,
  contestAuthor,
  proposalId,
  numberOfComments,
  className,
}) => {
  const commentId = useSearch({
    from: "/contest/$chain/$address/submission/$submission/",
    select: (search: Record<string, unknown>) => search.commentId as string,
  });
  const commentsRef = useRef<HTMLDivElement>(null);
  const isCompletedOrCanceled =
    contestState === ContestStateEnum.Completed || contestState === ContestStateEnum.Canceled;
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

  useEffect(() => {
    if (commentId) {
      getCommentsWithSpecificFirst(commentId);
      setTimeout(() => commentsRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
      return;
    }

    getAllCommentsIdsPerProposal();
  }, [proposalId, commentId]);

  const handleLoadMoreComments = () => {
    const nextPage = currentPage + 1;
    getCommentsPerPage(nextPage);
  };

  const handleDeleteComments = (selectedCommentsIds: string[]) => {
    deleteComments(selectedCommentsIds);
  };

  const handleAddComment = (content: string) => {
    addComment(content);
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full min-h-0" id="comments" ref={commentsRef}>
      {!isCompletedOrCanceled && (
        <div className="shrink-0">
          <CommentsForm
            contestChainId={contestChainId}
            onSend={handleAddComment}
            isAddingSuccess={isAddingSuccess}
            isAdding={isAdding}
          />
        </div>
      )}
      {comments.length > 0 && (
        <div className="flex-1 min-h-0">
          <CommentsList
            contestAuthor={contestAuthor}
            className={className}
            comments={comments}
            isLoading={isLoading}
            isPaginating={isPaginating}
            isDeleting={isDeleting}
            isDeletingSuccess={isDeletingSuccess}
            currentPage={currentPage}
            totalPages={totalPages}
            onDeleteSelectedComments={handleDeleteComments}
            onLoadMoreComments={handleLoadMoreComments}
            numberOfComments={numberOfComments}
          />
        </div>
      )}
    </div>
  );
};

export default Comments;
