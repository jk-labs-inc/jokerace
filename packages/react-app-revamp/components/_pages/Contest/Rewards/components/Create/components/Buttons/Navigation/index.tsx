import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import Image from "next/image";
import { FC } from "react";
import { useCreateRewardsStore } from "../../../store";

interface CreateRewardsNavigationProps {
  step: number;
  isDisabled?: boolean;
}

const CreateRewardsNavigation: FC<CreateRewardsNavigationProps> = ({ step, isDisabled }) => {
  const { setStep } = useCreateRewardsStore(state => state);

  const onNextHandler = () => {
    setStep(step + 1);
  };

  const onBackHandler = (step: number) => {
    setStep(step - 1);
  };

  return (
    <div className="flex gap-4 items-start mb-5">
      <div className="flex flex-col gap-2 items-center">
        <ButtonV3
          colorClass="text-[20px] bg-gradient-next rounded-[40px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
          size={ButtonSize.EXTRA_LARGE_LONG}
          onClick={onNextHandler}
          isDisabled={isDisabled}
        >
          next
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

export default CreateRewardsNavigation;
