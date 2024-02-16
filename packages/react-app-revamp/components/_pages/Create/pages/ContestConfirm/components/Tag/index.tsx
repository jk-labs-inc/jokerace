import { FC } from "react";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmTagProps {
  tag: string;
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmTag: FC<CreateContestConfirmTagProps> = ({ tag, step, onClick }) => {
  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)}>
      <div className="bg-neutral-10 text-true-black px-2 rounded-[8px] text-[16px] font-bold h-6">{tag}</div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmTag;
