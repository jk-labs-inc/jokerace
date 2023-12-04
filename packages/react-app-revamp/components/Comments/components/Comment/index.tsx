import EthereumAddress from "@components/UI/EtheuremAddress";
import { CheckIcon, TrashIcon } from "@heroicons/react/outline";
import { Comment } from "@hooks/useComments/store";
import { useContestStore } from "@hooks/useContest/store";
import moment from "moment";
import { FC } from "react";
import { useAccount } from "wagmi";

interface CommentProps {
  comment: Comment;
  toggleCommentSelection?: (commentId: string) => void;
  selectedCommentIds: string[];
}

const Comment: FC<CommentProps> = ({ comment, selectedCommentIds, toggleCommentSelection }) => {
  const { address } = useAccount();
  const contestAuthor = useContestStore(state => state.contestAuthorEthereumAddress);
  const localDate = moment(comment.createdAt).local().format("MMMM D, YYYY, h:mma");
  const formattedDate = localDate.replace(/(am|pm)/, match => match.toUpperCase());
  const allowDelete = address === comment.author || address === contestAuthor;
  const isSelected = selectedCommentIds.includes(comment.id);

  return (
    <div className="flex flex-col gap-4 animate-appear">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <EthereumAddress ethereumAddress={comment.author} shortenOnFallback />
          {allowDelete && (
            <div className="cursor-pointer" onClick={() => toggleCommentSelection?.(comment.id)}>
              <div className="relative">
                <CheckIcon
                  className={`absolute transform transition-all ease-in-out duration-300 
                    ${isSelected ? "opacity-100" : "opacity-0"}
                    h-7 w-7 text-primary-10 bg-white bg-true-black border border-neutral-11 hover:text-primary-9 
                    shadow-md hover:shadow-lg rounded-full`}
                />
                <TrashIcon
                  className={`absolute transition-opacity duration-300
                    ${isSelected ? "opacity-0" : "opacity-100"}
                    h-7 w-7 text-negative-11 bg-true-black hover:text-negative-10`}
                />
              </div>
            </div>
          )}
        </div>
        <p className="text-[16px] text-neutral-10 font-bold normal-case">{formattedDate}</p>
      </div>
      <div className="text-[16px] text-neutral-11 normal-case">{comment.content}</div>
    </div>
  );
};

export default Comment;
