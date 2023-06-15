import ButtonV3 from "@components/UI/ButtonV3";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import { useFundRewardsStore } from "@hooks/useFundRewards/store";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CreateRewardsFundingPoolSubmitProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CreateRewardsFundingPoolSubmit: FC<CreateRewardsFundingPoolSubmitProps> = ({ onClick, onCancel }) => {
  const [shake, setShake] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const isLoading = useDeployRewardsStore(state => state.isLoading);
  const { validationError, rewards } = useFundRewardsStore(state => state);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAttemptedSubmit(true);

    if (isLoading) {
      toast.warning("Please wait while your reward deployment is finished.");
    }

    const hasErrors = validationError.some(error => error.amount || error.tokenAddress);

    if (hasErrors) {
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
  }, [rewards]);

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

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

  return (
    <div>
      {!isLoading &&
        attemptedSubmit &&
        validationError.map((error, index) => (
          <div key={index} className="mb-4 text-negative-11 text-[16px] font-bold">
            {error.tokenAddress && <p>{error.tokenAddress}</p>}
            {error.amount && <p>{error.amount}</p>}
          </div>
        ))}

      <div className="flex gap-2 items-start pb-5 md:pb-0">
        <div className={`flex flex-col items-center gap-2`}>
          <ButtonV3 color={`bg-gradient-create ${shake ? "animate-shakeTop" : ""}`} size="large" onClick={handleClick}>
            fund pool!
          </ButtonV3>

          <div className="hidden lg:flex items-center gap-[2px] cursor-pointer group" onClick={onCancel}>
            <p className="text-[16px]">i’ll worry about this later</p>
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center mt-[5px] gap-[5px]">
          <p className="text-[16px] ml-[15px]">
            press <span className="font-bold capitalize">enter</span>
          </p>
          <Image src="/create-flow/enter.svg" alt="enter" width={14} height={14} />
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsFundingPoolSubmit;
