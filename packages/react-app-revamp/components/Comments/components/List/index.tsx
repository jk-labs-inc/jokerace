import { FC, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Comment from "../Comment";
import { Comment as CommentType } from "@hooks/useComments/store";
import { COMMENTS_PER_PAGE } from "@hooks/useComments";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";

interface CommentsListProps {
  comments: CommentType[];
  isLoading: boolean;
  onDeleteSelectedComments?: (selectedCommentIds: string[]) => void;
}

const CommentsList: FC<CommentsListProps> = ({ comments, isLoading, onDeleteSelectedComments }) => {
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const showDeleteButton = selectedCommentIds.length > 0;

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
    return (
      <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
        <div className="flex flex-col gap-10">
          {Array.from({ length: COMMENTS_PER_PAGE }).map((_, index) => (
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
  }

  return (
    <div className="flex flex-col gap-10">
      {comments.map(comment => (
        <Comment
          key={comment.id}
          comment={comment}
          selectedCommentIds={selectedCommentIds}
          toggleCommentSelection={toggleCommentSelection}
        />
      ))}
      {showDeleteButton && (
        <div className="flex sticky bottom-0 left-0 right-0 bg-white shadow-lg">
          <ButtonV3
            size={ButtonSize.EXTRA_LARGE}
            colorClass="bg-gradient-withdraw mx-auto animate-appear"
            onClick={() => onDeleteSelectedComments?.(selectedCommentIds)}
          >
            Delete {selectedCommentIds.length} {selectedCommentIds.length === 1 ? "comment" : "comments"}
          </ButtonV3>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
