/* eslint-disable react/no-unescaped-entities */
import useComments from "@hooks/useComments";
import { useCommentsStore } from "@hooks/useComments/store";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import CommentsForm from "./components/Form";
import CommentsList from "./components/List";

interface CommentsProps {
  contestAddress: string;
  contestChainId: number;
  proposalId: string;
  numberOfComments: number | null;
}

const Comments: FC<CommentsProps> = ({ contestAddress, contestChainId, proposalId, numberOfComments }) => {
  const query = useSearchParams();
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
    <div className="flex flex-col gap-4">
      <p className="text-[24px] text-neutral-11 font-bold">
        comments <span className="text-[16px]">({numberOfComments})</span>
      </p>
      <div className="flex flex-col w-full relative" id="comments" ref={commentsRef}>
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
        <div className="sticky bottom-0 left-0 right-0 bg-neutral-1">
          <CommentsForm
            contestChainId={contestChainId}
            onSend={addComment}
            isAddingSuccess={isAddingSuccess}
            isAdding={isAdding}
          />
        </div>
      </div>
    </div>
  );
};

export default Comments;
