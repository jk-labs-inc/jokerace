import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { COMMENTS_PER_PAGE } from "@hooks/useComments";
import { Comment as CommentType } from "@hooks/useComments/store";
import { FC, useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Comment from "../Comment";
import { useSearchParams } from "next/navigation";
import SimpleBar from "simplebar-react";

interface CommentsListProps {
  comments: CommentType[];
  isLoading: boolean;
  isPaginating: boolean;
  isDeleting: boolean;
  currentPage: number;
  numberOfComments: number | null;
  totalPages: number;
  isDeletingSuccess: boolean;
  onDeleteSelectedComments?: (selectedCommentIds: string[]) => void;
  onLoadMoreComments?: () => void;
  className?: string;
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
          <Skeleton height={50} width={660} />
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
  isPaginating,
  isDeletingSuccess,
  numberOfComments,
  onLoadMoreComments,
  currentPage,
  totalPages,
  className,
}) => {
  const query = useSearchParams();
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const showDeleteButton = selectedCommentIds.length > 0 && !isDeleting;
  const initialSkeletonCount = numberOfComments ? Math.min(numberOfComments, COMMENTS_PER_PAGE) : COMMENTS_PER_PAGE;
  const remainingCommentsToLoad = numberOfComments ? numberOfComments - comments.length : 0;
  const skeletonRemainingLoaderCount = Math.min(remainingCommentsToLoad, COMMENTS_PER_PAGE);
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.has("comments")) {
      commentsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [query]);

  useEffect(() => {
    if (isDeletingSuccess) {
      setSelectedCommentIds([]);
    }
  }, [isDeletingSuccess]);

  const toggleCommentSelection = (commentId: string) => {
    setSelectedCommentIds(prevIds => {
      if (prevIds.includes(commentId)) {
        return prevIds.filter(id => id !== commentId);
      } else {
        return [...prevIds, commentId];
      }
    });
  };

  const onDeleteSelectedCommentsHandler = () => {
    onDeleteSelectedComments?.(selectedCommentIds);
  };

  const onLoadMoreCommentsHandler = () => {
    onLoadMoreComments?.();
  };

  if (numberOfComments === null) {
    return (
      <p className="text-[16px] text-negative-11 font-bold">
        ruh-roh! An error occurred when retrieving comments for this proposal; try refreshing the page.
      </p>
    );
  }

  if (isLoading) {
    return <CommentsSkeleton length={initialSkeletonCount} />;
  }

  return (
    <div className="flex flex-col min-h-0 pb-4" ref={commentsRef}>
      <SimpleBar style={{ maxHeight: "100%", height: "100%" }} autoHide={false}>
        <div className="flex flex-col gap-4 pr-6">
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
                className={className}
              />
            );
          })}
          {isPaginating && <CommentsSkeleton length={skeletonRemainingLoaderCount} />}

          {currentPage < totalPages && !isLoading && (
            <div className="flex gap-2 items-center py-4 cursor-pointer" onClick={onLoadMoreCommentsHandler}>
              <p className="text-[16px] text-positive-11 font-bold uppercase">load more</p>
              <button className="transition-transform duration-500 ease-in-out transform rotate-180">
                <ChevronUpIcon height={20} className="text-positive-11" />
              </button>
            </div>
          )}
        </div>
      </SimpleBar>

      {showDeleteButton && (
        <div className="flex sticky bottom-0 left-0 right-0 bg-white shadow-lg">
          <ButtonV3
            size={ButtonSize.EXTRA_LARGE}
            colorClass="bg-gradient-withdraw mx-auto animate-appear"
            onClick={onDeleteSelectedCommentsHandler}
          >
            Delete {selectedCommentIds.length} {selectedCommentIds.length === 1 ? "comment" : "comments"}
          </ButtonV3>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
