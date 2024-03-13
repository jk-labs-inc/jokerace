import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC } from "react";
import { create } from "zustand";

interface CreateContestStartProps {
  onClick?: (value: boolean) => void;
}

interface CreateContestStartState {
  startContest: boolean;
  setStartContest: (value: boolean) => void;
}

export const useCreateContestStartStore = create<CreateContestStartState>(set => ({
  startContest: false,
  setStartContest: value => set({ startContest: value }),
}));

const CreateContestStart: FC<CreateContestStartProps> = ({ onClick }) => {
  const onCreateContestHandler = () => {
    onClick?.(true);
  };

  return (
    <div className="flex flex-col gap-10 lg:ml-[300px] mt-24 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <p className="text-true-white text-[24px] font-bold">let’s create a contest</p>
        <div className="flex flex-col gap-4">
          <p className="text-neutral-11 text-[20px]">creating a contest takes about 3-5 minutes. you’ll just need:</p>
          <ul className="flex flex-col pl-8">
            <li className="text-[20px] text-neutral-11 list-disc">
              <b>descriptions</b> about how the contest works
            </li>
            <li className="text-[20px] text-neutral-11 list-disc">
              <b>timing</b> of the submission and voting periods
            </li>
            <li className="text-[20px] text-neutral-11 list-disc">
              <b>allowlists</b> of who can vote and (optional) who can submit
            </li>
          </ul>
          <p className="text-neutral-11 text-[20px]">after you create the contest, you can add rewards for winners.</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 w-full md:w-[360px] h-48 pt-4 pb-6 pl-4 border-neutral-9 border rounded-[10px] hover:border-neutral-11 transition-colors duration-300">
          <p className="text-neutral-11 text-[20px] font-bold">create new contest</p>
          <p className="text-neutral-14 text-[16px]">
            create a brand new contest according <br /> to whatever criteria you want.
          </p>
          <ButtonV3
            colorClass={`bg-gradient-vote text-[20px] rounded-[30px] font-bold text-true-black pb-2 pt-1`}
            size={ButtonSize.EXTRA_LARGE}
            onClick={onCreateContestHandler}
          >
            create contest
          </ButtonV3>
        </div>
      </div>
    </div>
  );
};

export default CreateContestStart;
