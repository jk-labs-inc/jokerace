import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { useDeployRewardsStore } from "@hooks/useDeployRewards/store";
import { useFundRewardsStore } from "@hooks/useFundRewards/store";
import Image from "next/image";
import { FC, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CreateRewardsFundingPoolSubmitProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CreateRewardsFundingPoolSubmit: FC<CreateRewardsFundingPoolSubmitProps> = ({ onClick, onCancel }) => {
  const [shake, setShake] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const { isLoading: isDeployRewardsLoading } = useDeployRewardsStore(state => state);
  const { validationError, rewards, isLoading: isFundRewardsLoading } = useFundRewardsStore(state => state);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAttemptedSubmit(true);

      if (isDeployRewardsLoading) {
        toast.warning("Please wait while your reward deployment is finished.");
      }

      if (isFundRewardsLoading) return;

      const hasErrors = validationError.some(error => error.amount || error.tokenAddress);

      if (hasErrors) {
        setShake(true);
      } else {
        setAttemptedSubmit(false);
        if (onClick) {
          onClick(e);
        }
      }
    },
    [isDeployRewardsLoading, isFundRewardsLoading, validationError, onClick],
  );

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        handleClick(event as any);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClick]);

  return (
    <div>
      {!isDeployRewardsLoading &&
        attemptedSubmit &&
        validationError.map((error, index) => (
          <div key={index} className="mb-4 text-negative-11 text-[16px] font-bold">
            {error.tokenAddress && <p>{error.tokenAddress}</p>}
            {error.amount && <p>{error.amount}</p>}
          </div>
        ))}

      <div className="flex gap-2 items-start pb-5 md:pb-0">
        <div className={`flex flex-col items-center gap-2`}>
          <ButtonV3
            isDisabled={isDeployRewardsLoading || isFundRewardsLoading}
            colorClass={`bg-gradient-create ${shake ? "animate-shakeTop" : ""}`}
            size={ButtonSize.LARGE}
            onClick={handleClick}
          >
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
