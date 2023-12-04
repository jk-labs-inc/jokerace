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
  const { getAllCommentsIdsPerProposal, addComment, deleteComments } = useComments(
    contestAddress,
    contestChainId,
    proposalId,
  );
  const { comments, isLoading } = useCommentsStore(state => state);

  useEffect(() => {
    getAllCommentsIdsPerProposal();
  }, [proposalId]);

  return (
    <div className="flex flex-col gap-12 w-[660px]">
      <CommentsForm onSend={addComment} />
      <CommentsList
        comments={comments}
        isLoading={isLoading}
        onDeleteSelectedComments={selectedCommentsIds => deleteComments(selectedCommentsIds)}
      />
    </div>
  );
};

export default Comments;
