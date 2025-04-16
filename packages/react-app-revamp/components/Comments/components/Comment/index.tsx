import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Comment as CommentType } from "@hooks/useComments/store";
import { useContestStore } from "@hooks/useContest/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import moment from "moment";
import { FC } from "react";
import { useAccount } from "wagmi";
interface CommentProps {
  comment: CommentType;
  toggleCommentSelection?: (commentId: string) => void;
  selectedCommentIds: string[];
  className?: string;
}

const Comment: FC<CommentProps> = ({ comment, selectedCommentIds, toggleCommentSelection, className }) => {
  const { address } = useAccount();
  const contestAuthor = useContestStore(state => state.contestAuthorEthereumAddress);
  const timeAgo = moment(comment.createdAt).fromNow();
  const allowDelete = (address === comment.author || address === contestAuthor) && !comment.isDeleted;
  const isSelected = selectedCommentIds.includes(comment.id);

  return (
    <div className="flex flex-col gap-4 animate-reveal">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <UserProfileDisplay ethereumAddress={comment.author} shortenOnFallback textColor={className} />
          <span className="text-neutral-9">•</span>
          <span className="text-[14px] text-neutral-9">{timeAgo}</span>
          {allowDelete && (
            <div className="ml-auto cursor-pointer" onClick={() => toggleCommentSelection?.(comment.id)}>
              <CheckIcon
                className={`
                    ${isSelected ? "block" : "hidden"}
                    h-4 w-4 text-secondary-11 bg-white bg-true-black border border-secondary-11 hover:text-secondary-10 
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
      <div className={`prose ml-[15px] prose-invert text-[16px] border-l-2 border-neutral-2 pl-4 ${className}`}>
        <Interweave content={comment.content} matchers={[new UrlMatcher("url")]} />
      </div>
    </div>
  );
};

export default Comment;
