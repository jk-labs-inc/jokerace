import { FC } from "react";
import { useMedia } from "react-use";

interface ContestParamsDownvoteProps {
  downvote: boolean;
  onChange: (value: boolean) => void;
}

const ContestParamsDownvote: FC<ContestParamsDownvoteProps> = ({ downvote, onChange }) => {
  const isMobile = useMedia("(max-width: 768px)");

  return (
    <div className="flex flex-col gap-5">
      <p className="text-[20px] md:text-[24px] text-primary-10 font-bold">
        can players downvote—that is, vote <span className="italic">against</span> a submission?
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex w-full md:w-[380px] border border-neutral-10 rounded-[25px] overflow-hidden text-[20px] md:text-[18px]">
          <div
            className={`w-full px-4 py-1 cursor-pointer ${
              downvote ? "bg-neutral-11 text-true-black font-bold" : "bg-true-black text-neutral-10"
            }`}
            onClick={() => onChange(true)}
          >
            {isMobile ? "yes" : "enable downvoting"}
          </div>
          <div
            className={`w-full px-4 py-1 cursor-pointer ${
              !downvote ? "bg-neutral-11 text-true-black font-bold" : "bg-true-black text-neutral-10"
            }`}
            onClick={() => onChange(false)}
          >
            {isMobile ? "no" : "disable downvoting"}
          </div>
        </div>
        {downvote ? (
          <p className="text-[16px] text-negative-11 font-bold">
            please be aware that if you enable downvoting, you will not be able to create a rewards module.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ContestParamsDownvote;
