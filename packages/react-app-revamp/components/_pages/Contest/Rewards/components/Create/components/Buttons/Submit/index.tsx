import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC } from "react";
import { useCreateRewardsStore } from "../../../store";
import { useMediaQuery } from "react-responsive";
import MobileBottomButton from "@components/_pages/Create/components/Buttons/Mobile";

interface CreateRewardsSubmitButtonProps {
  step: number;
  onSubmit?: () => void;
}

const CreateRewardsSubmitButton: FC<CreateRewardsSubmitButtonProps> = ({ step, onSubmit }) => {
  const { setStep } = useCreateRewardsStore(state => state);
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });

  const onBackHandler = (step: number) => {
    setStep(step - 1);
  };

  if (isMobileOrTablet) {
    return (
      <MobileBottomButton>
        <div className={`flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2 px-8`}>
          <p className="text-[20px] text-neutral-11" onClick={() => onBackHandler(step)}>
            back
          </p>
          <ButtonV3
            size={ButtonSize.DEFAULT_LONG}
            onClick={onSubmit}
            colorClass="text-[20px] bg-gradient-purple rounded-[15px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            create pool
          </ButtonV3>
        </div>
      </MobileBottomButton>
    );
  }

  return (
    <div className="flex gap-4 items-start">
      <div className="flex flex-col gap-2 items-center">
        <ButtonV3
          colorClass="text-[20px] bg-gradient-purple rounded-[40px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
          size={ButtonSize.EXTRA_LARGE_LONG}
          onClick={onSubmit}
        >
          create pool
        </ButtonV3>
        <div
          className="hidden lg:flex items-center gap-[5px] -ml-[15px] cursor-pointer group"
          onClick={() => onBackHandler(step)}
        >
          <div className="transition-transform duration-200 group-hover:-translate-x-1">
            <img src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
          </div>
          <p className="text-[16px]">back</p>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsSubmitButton;
