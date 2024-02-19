import { FC, useState } from "react";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";

interface CreatContestConfirmSummaryProps {
  summary: string;
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreatContestConfirmSummary: FC<CreatContestConfirmSummaryProps> = ({ summary, step, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)} onHover={value => setIsHovered(value)}>
      <p
        className={`text-[16px] normal-case ${
          isHovered ? "text-neutral-11 font-bold" : "text-neutral-14"
        } transition-color duration-300`}
      >
        {summary}
      </p>
    </CreateContestConfirmLayout>
  );
};

export default CreatContestConfirmSummary;
