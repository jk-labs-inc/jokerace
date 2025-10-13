import { Avatar } from "@components/UI/Avatar";
import { UserProfileName } from "@components/UI/UserProfileName";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Comment as CommentType } from "@hooks/useComments/store";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import moment from "moment";
import { FC } from "react";
import { useAccount } from "wagmi";
import { ROUTE_VIEW_USER } from "@config/routes";
import useProfileData from "@hooks/useProfileData";

interface CommentProps {
  comment: CommentType;
  contestAuthor: string;
  toggleCommentSelection?: (commentId: string) => void;
  selectedCommentIds: string[];
  className?: string;
}

const getShortTimeAgo = (date: string | Date) => {
  const now = moment();
  const then = moment(date);
  const diff = now.diff(then);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} yr ago`;
  if (months > 0) return `${months} mo ago`;
  if (days > 0) return `${days} day ago`;
  if (hours > 0) return `${hours} hr ago`;
  if (minutes > 0) return `${minutes} min ago`;
  return `${seconds} sec ago`;
};

const Comment: FC<CommentProps> = ({
  comment,
  selectedCommentIds,
  toggleCommentSelection,
  className,
  contestAuthor,
}) => {
  const { address } = useAccount();
  const { profileName, profileAvatar } = useProfileData(comment.author, true, false);
  const timeAgo = getShortTimeAgo(comment.createdAt);
  const allowDelete = (address === comment.author || address === contestAuthor) && !comment.isDeleted;
  const isSelected = selectedCommentIds.includes(comment.id);

  const handleToggleSelection = () => {
    toggleCommentSelection?.(comment.id);
  };

  return (
    <div className="flex pt-2 gap-4 animate-reveal border-l-2 border-positive-17 pl-4">
      <Avatar
        src={profileAvatar}
        size="small"
        asLink
        href={`${ROUTE_VIEW_USER.replace("[address]", comment.author)}`}
      />
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <UserProfileName
              ethereumAddress={comment.author}
              profileName={profileName}
              size="extraSmall"
              textColor={className}
              target="_blank"
            />
            <span className="text-[12px] text-neutral-11">{timeAgo}</span>
          </div>
          {allowDelete && (
            <div className="ml-auto cursor-pointer" onClick={handleToggleSelection}>
              <CheckIcon
                className={`
                    ${isSelected ? "block" : "hidden"}
                    h-4 w-4 text-secondary-11 border border-secondary-11 hover:text-secondary-10 
                    shadow-md hover:shadow-lg rounded-full`}
              />
              <TrashIcon
                className={`
                    ${isSelected ? "hidden" : "block"}
                    h-4 w-4 text-negative-11 hover:text-negative-10 transition-colors duration-300 ease-in-out`}
              />
            </div>
          )}
        </div>

        <div className={`prose prose-invert text-[12px] bg-primary-2 px-2 py-1 rounded-4xl ${className}`}>
          <Interweave content={comment.content} matchers={[new UrlMatcher("url")]} />
        </div>
      </div>
    </div>
  );
};

export default Comment;
