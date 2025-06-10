import { FC } from "react";
import { useMediaQuery } from "react-responsive";

interface RewardsTiedStatusMessageProps {
  phase: "active" | "closed";
}

const RewardsTiedStatusMessage: FC<RewardsTiedStatusMessageProps> = ({ phase }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isClosed = phase === "closed";

  if (isMobile) {
    return (
      <>
        <p className="text-[16px] text-neutral-11">
          <span className="font-bold">your entry {isClosed ? "was" : "is"} affected by a tie!</span> funds for ties (and
          all ranks below the tie) revert to the contest creator to handle manually.{" "}
        </p>
        <p className="text-[16px] text-neutral-11">
          {isClosed ? "please check with them for any rewards." : "throw some votes on it to help break the tie."}
        </p>
      </>
    );
  }

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
