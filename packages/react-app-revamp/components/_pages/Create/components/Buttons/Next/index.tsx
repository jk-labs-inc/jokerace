import Button from "@components/UI/Button";
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
    <div className="flex gap-4 items-start">
      <div className="flex flex-col items-center gap-2">
        <Button
          className={`bg-gradient-next rounded-[10px] py-2 px-[38px] font-bold ${shake ? "animate-shakeTop" : ""}`}
          scale="header"
          onClick={handleClick}
        >
          next
        </Button>

        {step > 1 && (
          <div className="flex items-center gap-[2px] -ml-[15px]">
            <Image src="/create-flow/back.png" alt="back" width={20} height={18} className="mt-[1px]" />
            <p className="text-[16px]">back</p>
          </div>
        )}
      </div>
      <div className="flex items-center mt-[15px] gap-[2px]">
        <p className="text-[16px]">
          press <span className="font-bold capitalize">enter</span>
        </p>
        <Image src="/create-flow/enter.png" alt="enter" width={14} height={14} />
      </div>
    </div>
  );
};

export default CreateNextButton;
