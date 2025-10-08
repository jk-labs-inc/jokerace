import ButtonV3 from "@components/UI/ButtonV3";
import { FC } from "react";

interface SendFundsButtonProps {
  onSendFundsClick?: () => void;
}

const SendFundsButton: FC<SendFundsButtonProps> = ({ onSendFundsClick }) => {
  return (
    <ButtonV3
      onClick={onSendFundsClick}
      colorClass="bg-true-black hover:bg-neutral-11 hover:text-true-black transition-all duration-300"
      textColorClass="text-neutral-11 border border-neutral-11 rounded-[40px] text-[16px] font-bold"
    >
      send funds &gt;
    </ButtonV3>
  );
};

export default SendFundsButton;
