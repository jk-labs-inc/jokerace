import useComments from "@hooks/useComments";
import { useCommentsStore } from "@hooks/useComments/store";
import { ContestStateEnum } from "@hooks/useContestState/store";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { Abi } from "viem";
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
  const query = useSearchParams();
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
    if (query?.has("commentId")) {
      getCommentsWithSpecificFirst(query.get("commentId") ?? "");
      setTimeout(() => commentsRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
      return;
    }

    getAllCommentsIdsPerProposal();
  }, [proposalId, query]);

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
    <div className="flex flex-col gap-2 w-full h-full" id="comments" ref={commentsRef}>
      {!isCompletedOrCanceled && (
        <CommentsForm
          contestChainId={contestChainId}
          onSend={handleAddComment}
          isAddingSuccess={isAddingSuccess}
          isAdding={isAdding}
        />
      )}
      {comments.length > 0 && (
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
      )}
    </div>
  );
};

export default Comments;
