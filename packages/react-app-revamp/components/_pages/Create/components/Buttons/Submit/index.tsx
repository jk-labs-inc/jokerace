import Button from "@components/UI/Button";
import ButtonV3 from "@components/UI/ButtonV3";
import { usePreviousStep } from "@components/_pages/Create/hooks/usePreviousStep";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import { useState, useEffect, MouseEventHandler, FC } from "react";

interface CreateContestButtonProps {
  step: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const CreateContestButton: FC<CreateContestButtonProps> = ({ step, onClick }) => {
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
    <div className="flex gap-4 items-start pb-5 md:pb-0">
      <div className={`flex flex-col items-center gap-2`}>
        <ButtonV3
          color={`bg-gradient-create text-[24px] rounded-[10px] font-bold ${
            shake ? "animate-shakeTop" : ""
          }  text-true-black`}
          size="extraLarge"
          type="txAction"
          onClick={handleClick}
        >
          create contest!
        </ButtonV3>

        {step > 1 && (
          <div
            className="hidden lg:flex items-center gap-[2px] md:-ml-[15px] cursor-pointer group"
            onClick={onPreviousStep}
          >
            <div className="transition-transform duration-200 group-hover:-translate-x-1">
              <Image src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
            </div>
            <p className="text-[16px]">back</p>
          </div>
        )}
      </div>
      <div className="hidden lg:flex items-center mt-[15px] gap-[2px]">
        <p className="text-[16px]">
          press <span className="font-bold capitalize">enter</span>
        </p>
      </div>
    </div>
  );
};

export default CreateContestButton;
