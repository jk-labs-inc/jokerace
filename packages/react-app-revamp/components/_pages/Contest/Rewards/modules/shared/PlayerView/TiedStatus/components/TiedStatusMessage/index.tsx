import { FC } from "react";

interface RewardsTiedStatusMessageProps {
  phase: "active" | "closed";
}

const RewardsTiedStatusMessage: FC<RewardsTiedStatusMessageProps> = ({ phase }) => {
  const isClosed = phase === "closed";

  return (
    <>
      <p className="text-[16px] font-bold text-neutral-11">your entry {isClosed ? "was" : "is"} affected by a tie!</p>
      <p className="text-[16px] text-neutral-11">
        funds for ties (and all ranks below the tie) revert
        <br /> to the contest creator to handle manually.
      </p>
      <p className="text-[16px] text-neutral-11">
        {isClosed ? "please check with them for any rewards." : "throw some votes on it to help break the tie."}
      </p>
    </>
  );
};

export default RewardsTiedStatusMessage;
