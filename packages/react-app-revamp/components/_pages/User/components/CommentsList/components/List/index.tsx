import CustomLink from "@components/UI/Link";
import { chainsImages } from "@config/wagmi";
import { getProposalPagePath } from "@helpers/routing";
import { CommentsWithContest } from "lib/user/types";
import { FC } from "react";

interface UserCommentsListProps {
  comment: CommentsWithContest;
  isLoading: boolean;
}

const UserCommentsList: FC<UserCommentsListProps> = ({ comment }) => {
  return (
    <CustomLink
      to={getProposalPagePath(comment.network_name.toLowerCase(), comment.contest_address, comment.proposal_id)}
      search={{ commentId: comment.comment_id }}
      target="_blank"
    >
      <div
        className="flex items-center gap-6 border-t border-neutral-9 py-4 p-3 
        hover:bg-neutral-3 transition-colors duration-500 ease-in-out cursor-pointer text-[16px]"
      >
        <img src={chainsImages[comment.network_name.toLowerCase()]} width={32} height={32} alt={""} />
        <p>
          Comment {comment.comment_id.slice(0, 5)} for the proposal {comment.proposal_id.slice(0, 5)} in the{" "}
          {comment.contest.title} contest
        </p>
      </div>
    </CustomLink>
  );
};

export default UserCommentsList;
