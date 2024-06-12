import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import Image from "next/image";
import { FC } from "react";
import { useCreateRewardsStore } from "../../../store";

interface CreateRewardsSubmitButtonProps {
  step: number;
  onSubmit?: () => void;
}

const CreateRewardsSubmitButton: FC<CreateRewardsSubmitButtonProps> = ({ step, onSubmit }) => {
  const { setStep } = useCreateRewardsStore(state => state);

  const onBackHandler = (step: number) => {
    setStep(step - 1);
  };

  return (
    <div className="flex gap-4 items-start">
      <div className="flex flex-col gap-2 items-center">
        <ButtonV3
          colorClass="text-[20px] bg-gradient-create-pool rounded-[40px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
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
            <Image src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
          </div>
          <p className="text-[16px]">back</p>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsSubmitButton;
