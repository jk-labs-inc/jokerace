/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import Collapsible from "@components/UI/Collapsible";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import useComments from "@hooks/useComments";
import { useCommentsStore } from "@hooks/useComments/store";
import useContractVersion from "@hooks/useContractVersion";
import { compareVersions } from "compare-versions";
import { COMMENTS_VERSION } from "lib/proposal";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useRef, useState } from "react";
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
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
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
    <div className="flex flex-col gap-12" id="comments" ref={commentsRef}>
      <div className="flex gap-4 items-center">
        <p className="text-[24px] text-neutral-11 font-bold">comments</p>
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`transition-transform duration-500 ease-in-out transform ${isCommentsOpen ? "" : "rotate-180"}`}
        >
          <ChevronUpIcon height={30} />
        </button>
      </div>
      <Collapsible isOpen={isCommentsOpen}>
        <div className="flex flex-col gap-12 w-full md:w-[660px]">
          <CommentsForm
            contestChainId={contestChainId}
            onSend={addComment}
            isAddingSuccess={isAddingSuccess}
            isAdding={isAdding}
          />
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
        </div>
      </Collapsible>
    </div>
  );
};

export default Comments;
