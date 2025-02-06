import { FC } from "react";
import { Steps } from "../..";
import CreateContestConfirmLayout from "../Layout";

interface CreateContestConfirmTitleProps {
  title: string;
  step: Steps;
  onClick?: (step: Steps) => void;
}

const CreateContestConfirmTitle: FC<CreateContestConfirmTitleProps> = ({ step, title, onClick }) => {
  return (
    <CreateContestConfirmLayout onClick={() => onClick?.(step)}>
      <div className="flex flex-col gap-2">
        <p className="text-neutral-9 text-[12px] font-bold uppercase">title</p>
        <p className="text-[20px] text-neutral-11 leading-normal normal-case font-bold">{title}</p>
      </div>
    </CreateContestConfirmLayout>
  );
};

export default CreateContestConfirmTitle;
