import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { COMMENTS_PER_PAGE } from "@hooks/useComments";
import { Comment as CommentType } from "@hooks/useComments/store";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Comment from "../Comment";

interface CommentsListProps {
  allCommentsIdsPerProposal: string[];
  comments: CommentType[];
  isLoading: boolean;
  isDeleting: boolean;
  onDeleteSelectedComments?: (selectedCommentIds: string[]) => void;
  onLoadMoreComments?: () => void;
}

interface CommentsSkeletonProps {
  length: number;
  highlightColor?: string;
}

const CommentsSkeleton: React.FC<CommentsSkeletonProps> = ({ length, highlightColor = "#FFE25B" }) => (
  <SkeletonTheme baseColor="#706f78" highlightColor={highlightColor} duration={1}>
    <div className="flex flex-col gap-10">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton circle={true} height={32} width={32} />
            <Skeleton width={100} height={16} className="mt-3" />
          </div>
          <Skeleton height={15} width={200} />
          <Skeleton height={50} width={600} />
        </div>
      ))}
    </div>
  </SkeletonTheme>
);

const CommentsList: FC<CommentsListProps> = ({
  comments,
  isLoading,
  onDeleteSelectedComments,
  isDeleting,
  allCommentsIdsPerProposal,
  onLoadMoreComments,
}) => {
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const showDeleteButton = selectedCommentIds.length > 0;
  const remainingCommentsToLoad = allCommentsIdsPerProposal.length - comments.length;
  const skeletonRemainingLoaderCount = Math.min(remainingCommentsToLoad, COMMENTS_PER_PAGE);

  const toggleCommentSelection = (commentId: string) => {
    setSelectedCommentIds(prevIds => {
      if (prevIds.includes(commentId)) {
        return prevIds.filter(id => id !== commentId);
      } else {
        return [...prevIds, commentId];
      }
    });
  };

  if (isLoading) {
    return <CommentsSkeleton length={12} />;
  }

  return (
    <InfiniteScroll
      className="infiniteScroll"
      dataLength={comments.length}
      hasMore={comments.length < allCommentsIdsPerProposal.length}
      loader={
        <div className="mt-10">
          <CommentsSkeleton length={skeletonRemainingLoaderCount} />
        </div>
      }
      next={() => onLoadMoreComments?.()}
      scrollableTarget="scrollableDiv"
    >
      <div className="flex flex-col gap-10">
        {comments.map(comment => {
          if (selectedCommentIds.includes(comment.id) && isDeleting) {
            return <CommentsSkeleton key={comment.id} length={1} highlightColor="#FF78A9" />;
          }

          return (
            <Comment
              key={comment.id}
              comment={comment}
              selectedCommentIds={selectedCommentIds}
              toggleCommentSelection={toggleCommentSelection}
            />
          );
        })}
        {showDeleteButton && (
          <div className="flex sticky bottom-0 left-0 right-0 bg-white shadow-lg">
            <ButtonV3
              size={ButtonSize.EXTRA_LARGE}
              colorClass="bg-gradient-withdraw mx-auto animate-appear"
              onClick={() => onDeleteSelectedComments?.(selectedCommentIds)}
              isDisabled={isDeleting}
            >
              Delete {selectedCommentIds.length} {selectedCommentIds.length === 1 ? "comment" : "comments"}
            </ButtonV3>
          </div>
        )}
      </div>
    </InfiniteScroll>
  );
};

export default CommentsList;
