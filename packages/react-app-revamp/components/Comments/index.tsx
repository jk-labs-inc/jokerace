/* eslint-disable react-hooks/exhaustive-deps */
import useComments from "@hooks/useComments";
import { useCommentsStore } from "@hooks/useComments/store";
import { FC, useEffect } from "react";
import CommentsForm from "./components/Form";
import CommentsList from "./components/List";

interface CommentsProps {
  contestAddress: string;
  contestChainId: number;
  proposalId: string;
}

const Comments: FC<CommentsProps> = ({ contestAddress, contestChainId, proposalId }) => {
  const { getAllCommentsIdsPerProposal, addComment, deleteComments, getCommentsPerPage } = useComments(
    contestAddress,
    contestChainId,
    proposalId,
  );
  const { comments, isLoading, isDeleting, allCommentsIdsPerProposal, currentPage } = useCommentsStore(state => state);

  useEffect(() => {
    getAllCommentsIdsPerProposal();
  }, [proposalId]);

  const onLoadMoreComments = () => {
    const nextPage = currentPage + 1;
    getCommentsPerPage(nextPage);
  };

  return (
    <div className="flex flex-col gap-12 w-[660px]">
      <CommentsForm onSend={addComment} />
      <CommentsList
        allCommentsIdsPerProposal={allCommentsIdsPerProposal}
        comments={comments}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onDeleteSelectedComments={selectedCommentsIds => deleteComments(selectedCommentsIds)}
        onLoadMoreComments={onLoadMoreComments}
      />
    </div>
  );
};

export default Comments;
