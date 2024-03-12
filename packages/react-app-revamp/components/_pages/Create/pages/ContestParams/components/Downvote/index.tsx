import { FC } from "react";
import { useMedia } from "react-use";

interface ContestParamsDownvoteProps {
  downvote: boolean;
  onChange: (value: boolean) => void;
}

const ContestParamsDownvote: FC<ContestParamsDownvoteProps> = ({ downvote, onChange }) => {
  const isMobile = useMedia("(max-width: 768px)");

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        {isMobile ? (
          <>can players downvote?</>
        ) : (
          <>
            can players downvote—that is, vote <span className="italic font-bold">against</span> a submission?
          </>
        )}
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex w-2/3 md:w-[432px] border border-neutral-10 rounded-[25px] overflow-hidden text-[20px]">
          <div
            className={`w-full px-4 py-1 cursor-pointer ${
              !downvote ? "bg-neutral-14 text-true-black font-bold" : "bg-true-black text-neutral-11"
            }`}
            onClick={() => onChange(false)}
          >
            {isMobile ? "no" : "disable downvoting"}
          </div>
          <div
            className={`w-full px-4 py-1 cursor-pointer ${
              downvote ? "bg-neutral-14 text-true-black font-bold" : "bg-true-black text-neutral-11"
            }`}
            onClick={() => onChange(true)}
          >
            {isMobile ? "yes" : "enable downvoting"}
          </div>
        </div>
        {downvote ? (
          <p className="text-[16px] text-negative-11 ">note: rewards will not be possible with downvoting enabled</p>
        ) : null}
      </div>
    </div>
  );
};

export default ContestParamsDownvote;
