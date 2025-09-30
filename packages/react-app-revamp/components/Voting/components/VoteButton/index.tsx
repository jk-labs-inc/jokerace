import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import { FC } from "react";

interface VoteButtonProps {
  isDisabled: boolean;
  onVote: () => void;
}

const VoteButton: FC<VoteButtonProps> = ({ isDisabled, onVote }) => {
  const handleClick = () => {
    onVote();
  };

  return (
    <ButtonV3
      type={ButtonType.TX_ACTION}
      isDisabled={isDisabled}
      colorClass="px-[20px] bg-gradient-purple rounded-[40px] w-full"
      size={ButtonSize.FULL}
      onClick={handleClick}
    >
      <span className="w-full text-center">buy votes</span>
    </ButtonV3>
  );
};

export default VoteButton;
