import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import { FC } from "react";

interface VoteButtonProps {
  isDisabled: boolean;
  isInvalidBalance: boolean;
  onVote?: () => void;
  onAddFunds?: () => void;
}

const VoteButton: FC<VoteButtonProps> = ({ isDisabled, isInvalidBalance, onVote, onAddFunds }) => {
  const buttonText = isInvalidBalance ? "add funds to vote" : "buy votes";

  const handleClick = () => {
    if (isInvalidBalance) {
      onAddFunds?.();
    } else {
      onVote?.();
    }
  };

  return (
    <ButtonV3
      type={ButtonType.TX_ACTION}
      isDisabled={isInvalidBalance ? false : isDisabled}
      colorClass="px-[20px] text-[24px] font-bold bg-gradient-purple rounded-[40px] w-full"
      size={ButtonSize.FULL}
      onClick={handleClick}
    >
      <span className="w-full text-center">{buttonText}</span>
    </ButtonV3>
  );
};

export default VoteButton;
