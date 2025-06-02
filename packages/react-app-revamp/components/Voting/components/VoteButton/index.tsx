import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import { VotingButtonText } from "@components/Voting";
import { FC } from "react";

interface VoteButtonProps {
  buttonText: VotingButtonText;
  isDisabled: boolean;
  onVote: () => void;
  onAddFunds?: () => void;
}

const VoteButton: FC<VoteButtonProps> = ({ buttonText, isDisabled, onVote, onAddFunds }) => {
  const handleClick = () => {
    if (buttonText === VotingButtonText.ADD_FUNDS) {
      onAddFunds?.();
    } else {
      onVote();
    }
  };

  return (
    <ButtonV3
      type={ButtonType.TX_ACTION}
      isDisabled={buttonText === VotingButtonText.ADD_FUNDS ? false : isDisabled}
      colorClass="px-[20px] bg-gradient-purple rounded-[40px] w-full"
      size={ButtonSize.FULL}
      onClick={handleClick}
    >
      <span className="w-full text-center">{buttonText}</span>
    </ButtonV3>
  );
};

export default VoteButton;
