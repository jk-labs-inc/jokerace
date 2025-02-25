import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import GradientText from "@components/UI/GradientText";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import { create } from "zustand";

interface CreateContestStartProps {
  onCreateContest?: (value: boolean) => void;
  onCreateContestWithTemplate?: (value: boolean) => void;
}

interface CreateContestStartState {
  startContest: boolean;
  startContestWithTemplate: boolean;
  setStartContest: (value: boolean) => void;
  setStartContestWithTemplate: (value: boolean) => void;
}

export const useCreateContestStartStore = create<CreateContestStartState>(set => ({
  startContest: false,
  startContestWithTemplate: false,
  setStartContest: value => set({ startContest: value }),
  setStartContestWithTemplate: value => set({ startContestWithTemplate: value }),
}));

const CreateContestStart: FC<CreateContestStartProps> = ({ onCreateContest, onCreateContestWithTemplate }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const stepTitle = isMobile ? "create a contest" : "let's create a contest";

  const onCreateContestHandler = () => {
    onCreateContest?.(true);
  };

  const onCreateContestWithTemplateHandler = () => {
    onCreateContestWithTemplate?.(true);
  };

  return (
    <div className="flex flex-col gap-10 lg:ml-[300px] mt-6 md:mt-24 animate-reveal">
      <div className="flex flex-col gap-2">
        <GradientText
          text={stepTitle}
          isStrikethrough={false}
          textSizeClassName="text-[24px] font-bold"
          isFontSabo={false}
        />
        <div className="flex flex-col gap-6">
          <p className="text-neutral-11 text-[20px]">creating a contest takes about 1-3 minutes. you can customize:</p>
          <ul className="flex flex-col pl-8">
            <li className="text-[20px] text-neutral-11 list-disc">
              {isMobile ? "who gets to enter & vote" : "who gets to enter and vote"}
            </li>
            <li className="text-[20px] text-neutral-11 list-disc">
              {isMobile ? "how much they pay" : "how much they pay to enter and vote"}
            </li>
            <li className="text-[20px] text-neutral-11 list-disc">
              {isMobile ? "how long they have to enter & vote" : "how long they have to enter and vote"}
            </li>
            <li className="text-[20px] text-neutral-11 list-disc">whether you want a gallery view</li>
          </ul>
          <p className="text-neutral-11 text-[20px]">add any title and description you like, and you're done.</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 w-full md:w-[360px] h-48 pt-4 pb-6 pl-4 border-neutral-9 border rounded-[10px] hover:border-neutral-11 transition-colors duration-300">
            <p className="text-neutral-11 text-[20px] font-bold">create new contest</p>
            <p className="text-neutral-14 text-[16px]">
              create a brand new contest in 5 steps <br /> according to whatever criteria you want.
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
        <div className="flex flex-col gap-8 pointer-events-none">
          <div className="flex flex-col gap-4 w-full md:w-[360px] h-48 pt-4 pb-6 pl-4 border-neutral-9 border rounded-[10px] hover:border-neutral-11 transition-colors duration-300 opacity-50 relative">
            <div className="absolute top-4 right-4 z-10 border rounded-lg border-neutral-9 px-2 py-1">
              <p className="text-neutral-11 text-[14px] font-bold">temporarily paused</p>
            </div>
            <div className="blur-[2px] flex flex-col gap-4">
              <p className="text-neutral-11 text-[20px] font-bold">use a template</p>
              <p className="text-neutral-14 text-[16px]">
                create a contest in a couple taps by choosing <br />a prefilled template—and edit it if you like
              </p>
              <ButtonV3
                colorClass={`bg-gradient-vote text-[20px] rounded-[30px] font-bold text-true-black pb-2 pt-1`}
                size={ButtonSize.EXTRA_LARGE}
                onClick={onCreateContestWithTemplateHandler}
              >
                use a template
              </ButtonV3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestStart;
