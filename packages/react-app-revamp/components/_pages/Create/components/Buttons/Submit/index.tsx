import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import { usePreviousStep } from "@components/_pages/Create/hooks/usePreviousStep";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import { FC, MouseEventHandler, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import MobileBottomButton from "../Mobile";

interface CreateContestButtonProps {
  step: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
}

const CreateContestButton: FC<CreateContestButtonProps> = ({ step, onClick, isDisabled }) => {
  const { errors } = useDeployContestStore(state => state);
  const { isConnected } = useAccount();
  const [shake, setShake] = useState(false);
  const onPreviousStep = usePreviousStep();
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });

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

  if (isMobileOrTablet)
    return (
      <MobileBottomButton>
        <div className={`flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2   px-8`}>
          <p className="text-[20px] text-neutral-11" onClick={onPreviousStep}>
            back
          </p>
          <ButtonV3
            onClick={handleClick}
            colorClass="text-[20px] bg-gradient-create rounded-[15px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            {isConnected ? "create" : "connect wallet"}
          </ButtonV3>
        </div>
      </MobileBottomButton>
    );

  return (
    <div className="flex gap-4 items-start pb-5 md:pb-0">
      <div className={`flex flex-col items-center gap-4`}>
        <ButtonV3
          isDisabled={isDisabled}
          colorClass={`bg-gradient-create text-[20px] rounded-[10px] font-bold ${
            shake ? "animate-shakeTop" : ""
          }  text-true-black`}
          size={ButtonSize.LARGE}
          type={ButtonType.TX_ACTION}
          onClick={handleClick}
        >
          {isConnected ? "create contest" : "connect wallet"}
        </ButtonV3>

        <div
          className="hidden lg:flex items-center gap-[2px] md:-ml-[15px] cursor-pointer group"
          onClick={onPreviousStep}
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

export default CreateContestButton;
