import ButtonV3 from "@components/UI/ButtonV3";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface CreateRewardsPoolSubmitProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CreateRewardsPoolSubmit: FC<CreateRewardsPoolSubmitProps> = ({ onClick, onCancel }) => {
  const [shake, setShake] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const { validationError, ranks, setCancel } = useDeployRewardsStore(state => state);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAttemptedSubmit(true);

    const validationErrorExists = Object.keys(validationError).length > 0;

    if (validationErrorExists) {
      setShake(true);
    } else {
      setAttemptedSubmit(false);
      if (onClick) {
        onClick(e);
      }
    }
  };

  useEffect(() => {
    setAttemptedSubmit(false);
  }, [ranks]);

  useEffect(() => {
    // Define your keydown handler
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation(); // Stop event bubbling
        handleClick(event as any); // Call your handleClick function
      }
    };

    // Add the event listener
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClick]); // Make sure to list all dependencies

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const hasError = validationError && (validationError.duplicateRank || validationError.zeroProportion);

  return (
    <div>
      {hasError && attemptedSubmit && (
        <div className="mb-4 text-negative-11 text-[16px] font-bold">
          {validationError.duplicateRank && <p>{validationError.duplicateRank}</p>}
          {validationError.zeroProportion && <p>{validationError.zeroProportion}</p>}
        </div>
      )}

      <div className="flex gap-2 items-start pb-5 md:pb-0">
        <div className="flex flex-col items-center gap-2">
          <ButtonV3 color={`bg-gradient-create ${shake ? "animate-shakeTop" : ""}`} size="large" onClick={handleClick}>
            create pool!
          </ButtonV3>

          <div className="flex items-center gap-[2px] cursor-pointer group" onClick={onCancel}>
            <p className="text-[16px]">i’ll worry about this later</p>
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center mt-[5px] gap-[5px]">
          <p className="text-[16px]">
            press <span className="font-bold capitalize">enter</span>
          </p>
          <Image src="/create-flow/enter.svg" alt="enter" width={14} height={14} />
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsPoolSubmit;
