import { FC } from "react";

interface VoteTypeSelectorProps {
  isUpvote: boolean;
  onTypeChange: (isUpvote: boolean) => void;
}

const VoteTypeSelector: FC<VoteTypeSelectorProps> = ({ isUpvote, onTypeChange }) => {
  return (
    <div className="flex w-full border border-neutral-10 rounded-[25px] overflow-hidden text-[16px] text-center">
      <div
        className={`w-full px-4 py-1 cursor-pointer ${
          isUpvote ? "bg-neutral-11 text-true-black font-bold" : "bg-true-black text-neutral-10"
        }`}
        onClick={() => onTypeChange(true)}
      >
        upvote
      </div>
      <div
        className={`w-full px-4 py-1 cursor-pointer ${
          !isUpvote ? "bg-neutral-11 text-true-black font-bold" : "bg-true-black text-neutral-10"
        }`}
        onClick={() => onTypeChange(false)}
      >
        downvote
      </div>
    </div>
  );
};

export default VoteTypeSelector;
