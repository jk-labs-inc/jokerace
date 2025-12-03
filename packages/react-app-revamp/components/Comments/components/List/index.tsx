import { COMMENTS_PER_PAGE } from "@hooks/useComments";
import { Comment as CommentType } from "@hooks/useComments/store";
import { useSearch } from "@tanstack/react-router";
import { FC, useEffect, useRef, useState } from "react";
import Comment from "../Comment";
import CommentsSkeleton from "./components/CommentsSkeleton";
import DeleteButton from "./components/DeleteButton";
import LoadMoreButton from "./components/LoadMoreButton";
import MotionSpinner from "@components/UI/MotionSpinner";
import useScrollFade from "@hooks/useScrollFade";

interface CommentsListProps {
  comments: CommentType[];
  isLoading: boolean;
  isPaginating: boolean;
  isDeleting: boolean;
  contestAuthor: string;
  currentPage: number;
  numberOfComments: number | null;
  totalPages: number;
  isDeletingSuccess: boolean;
  onDeleteSelectedComments?: (selectedCommentIds: string[]) => void;
  onLoadMoreComments?: () => void;
  className?: string;
}

const CommentsList: FC<CommentsListProps> = ({
  comments,
  isLoading,
  onDeleteSelectedComments,
  contestAuthor,
  isDeleting,
  isPaginating,
  isDeletingSuccess,
  numberOfComments,
  onLoadMoreComments,
  currentPage,
  totalPages,
  className,
}) => {
  const search = useSearch({
    from: "/contest/$chain/$address/submission/$submission",
  });
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const commentsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const showDeleteButton = selectedCommentIds.length > 0 && !isDeleting;
  const initialSkeletonCount = numberOfComments ? Math.min(numberOfComments, COMMENTS_PER_PAGE) : COMMENTS_PER_PAGE;
  const showLoadMore = currentPage < totalPages && !isLoading;

  const { shouldApplyFade, maskImageStyle } = useScrollFade(scrollContainerRef, comments.length, [comments]);

  useEffect(() => {
    if (search.comments) {
      commentsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [search.comments]);

  useEffect(() => {
    if (isDeletingSuccess) {
      setSelectedCommentIds([]);
    }
  }, [isDeletingSuccess]);

  const toggleCommentSelection = (commentId: string) => {
    setSelectedCommentIds(prevIds => {
      if (prevIds.includes(commentId)) {
        return prevIds.filter(id => id !== commentId);
      }
      return [...prevIds, commentId];
    });
  };

  const handleDeleteSelectedComments = () => {
    onDeleteSelectedComments?.(selectedCommentIds);
  };

  const handleLoadMoreComments = () => {
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
    <div className="flex flex-col h-full" ref={commentsRef}>
      <div
        ref={scrollContainerRef}
        className="flex flex-col gap-6 pr-4 min-h-0 overflow-y-auto flex-1"
        style={
          shouldApplyFade
            ? {
                maskImage: maskImageStyle,
                WebkitMaskImage: maskImageStyle,
              }
            : undefined
        }
      >
        {comments.map(comment => {
          if (selectedCommentIds.includes(comment.id) && isDeleting) {
            return <CommentsSkeleton key={comment.id} length={1} highlightColor="#FF78A9" />;
          }
          return (
            <Comment
              key={comment.id}
              comment={comment}
              contestAuthor={contestAuthor}
              selectedCommentIds={selectedCommentIds}
              toggleCommentSelection={toggleCommentSelection}
              className={className}
            />
          );
        })}
        {isPaginating && (
          <div className="flex items-center justify-center py-4">
            <MotionSpinner size={32} />
          </div>
        )}

        {showLoadMore && <LoadMoreButton onLoadMore={handleLoadMoreComments} />}
      </div>

      {showDeleteButton && (
        <DeleteButton selectedCount={selectedCommentIds.length} onDelete={handleDeleteSelectedComments} />
      )}
    </div>
  );
};

export default CommentsList;
