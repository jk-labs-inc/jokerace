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
}

const Comment: FC<CommentProps> = ({ comment, selectedCommentIds, toggleCommentSelection }) => {
  const { address } = useAccount();
  const contestAuthor = useContestStore(state => state.contestAuthorEthereumAddress);
  const localDate = moment(comment.createdAt).local().format("MMMM D, YYYY, h:mma");
  const formattedDate = localDate.replace(/(am|pm)/, match => match.toUpperCase());
  const allowDelete = (address === comment.author || address === contestAuthor) && !comment.isDeleted;
  const isSelected = selectedCommentIds.includes(comment.id);

  return (
    <div className="flex flex-col gap-4 animate-reveal">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <UserProfileDisplay ethereumAddress={comment.author} shortenOnFallback />
          {allowDelete && (
            <div className="cursor-pointer" onClick={() => toggleCommentSelection?.(comment.id)}>
              <CheckIcon
                className={`
                    ${isSelected ? "block" : "hidden"}
                    h-7 w-7 text-primary-10 bg-white bg-true-black border border-neutral-11 hover:text-primary-9 
                    shadow-md hover:shadow-lg rounded-full`}
              />
              <TrashIcon
                className={`
                    ${isSelected ? "hidden" : "block"}
                    h-7 w-7 text-negative-11 bg-true-black hover:text-negative-10`}
              />
            </div>
          )}
        </div>
        <p className="text-[16px] text-neutral-10 font-bold normal-case">{formattedDate}</p>
      </div>
      <div className="prose prose-invert">
        <Interweave content={comment.content} matchers={[new UrlMatcher("url")]} />
      </div>
    </div>
  );
};

export default Comment;
