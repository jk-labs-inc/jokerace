import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Comment as CommentType } from "@hooks/useComments/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import moment from "moment";
import { FC } from "react";
import { useAccount } from "wagmi";

interface CommentProps {
  comment: CommentType;
  contestAuthor: string;
  toggleCommentSelection?: (commentId: string) => void;
  selectedCommentIds: string[];
  className?: string;
}

const Comment: FC<CommentProps> = ({
  comment,
  selectedCommentIds,
  toggleCommentSelection,
  className,
  contestAuthor,
}) => {
  const { address } = useAccount();
  const timeAgo = moment(comment.createdAt).fromNow();
  const allowDelete = (address === comment.author || address === contestAuthor) && !comment.isDeleted;
  const isSelected = selectedCommentIds.includes(comment.id);

  const handleToggleSelection = () => {
    toggleCommentSelection?.(comment.id);
  };

  return (
    <div className="flex flex-col pt-4 gap-2 animate-reveal">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <UserProfileDisplay
            ethereumAddress={comment.author}
            shortenOnFallback
            textColor={className}
            size="extraSmall"
          />
          <span className="text-[12px] text-neutral-11">{timeAgo}</span>
          {allowDelete && (
            <div className="ml-auto cursor-pointer" onClick={handleToggleSelection}>
              <CheckIcon
                className={`
                    ${isSelected ? "block" : "hidden"}
                    h-4 w-4 text-secondary-11  bg-true-black border border-secondary-11 hover:text-secondary-10 
                    shadow-md hover:shadow-lg rounded-full`}
              />
              <TrashIcon
                className={`
                    ${isSelected ? "hidden" : "block"}
                    h-4 w-4 text-negative-11 bg-true-black hover:text-negative-10 transition-colors duration-300 ease-in-out`}
              />
            </div>
          )}
        </div>
      </div>
      <div className={`prose ml-[15px] prose-invert text-[16px] pl-4 ${className}`}>
        <Interweave content={comment.content} matchers={[new UrlMatcher("url")]} />
      </div>
    </div>
  );
};

export default Comment;
