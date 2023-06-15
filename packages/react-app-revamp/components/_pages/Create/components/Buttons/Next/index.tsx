import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import { usePreviousStep } from "@components/_pages/Create/hooks/usePreviousStep";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import { FC, MouseEventHandler, useEffect, useState } from "react";

interface CreateNextButtonProps {
  step: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const CreateNextButton: FC<CreateNextButtonProps> = ({ step, onClick }) => {
  const { errors } = useDeployContestStore(state => state);
  const [shake, setShake] = useState(false);
  const onPreviousStep = usePreviousStep();

  useEffect(() => {
    // If there's an error for the current step, shake the button
    if (errors.find(error => error.step === step - 1)) {
      setShake(true);
    } else {
      setShake(false);
    }
  }, [errors, step]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If there's an error, shake the button
    if (errors.find(error => error.step === step - 1)) {
      setShake(true);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="flex gap-4 items-start mb-5">
      <div className={`flex flex-col items-center gap-2`}>
        <ButtonV3
          color={`bg-gradient-next rounded-[10px] font-bold ${shake ? "animate-shakeTop" : ""} text-true-black`}
          size="large"
          onClick={handleClick}
        >
          next
        </ButtonV3>

        {step > 1 && (
          <div
            className="hidden lg:flex items-center gap-[5px] -ml-[15px] cursor-pointer group"
            onClick={onPreviousStep}
          >
            <div className="transition-transform duration-200 group-hover:-translate-x-1">
              <Image src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
            </div>
            <p className="text-[16px]">back</p>
          </div>
        )}
      </div>
      <div className="hidden lg:flex lg:items-center mt-[5px] gap-[5px]">
        <p className="text-[16px]">
          press <span className="font-bold capitalize">enter</span>
        </p>
        <Image src="/create-flow/enter.svg" alt="enter" width={14} height={14} />
      </div>
    </div>
  );
};

export default CreateNextButton;
