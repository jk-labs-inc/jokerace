import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { useMediaQuery } from "react-responsive";

interface DialogMaxVotesAlertProps {
  token: string;
  totalCost: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  buttonSize?: ButtonSize;
}

const DialogMaxVotesAlert: FC<DialogMaxVotesAlertProps> = ({
  token,
  totalCost,
  onConfirm,
  onCancel,
  buttonSize = ButtonSize.EXTRA_LARGE_LONG_MOBILE,
}) => {
  return (
    <div className="flex flex-col gap-8 animate-swingInLeft">
      <p className="text-neutral-11 text-[24px] font-bold">vote it all 😈</p>
      <div className="flex flex-col gap-4">
        <p className="text-neutral-11 text-[16px]">
          looks like you're planning to vote with 100% of your available funds in
          <span className="normal-case"> {token}</span>
        </p>
        <p className="text-neutral-11 text-[16px]">
          🚨 you will spend {totalCost} <span className="normal-case">{token}</span>
        </p>
        <p className="text-neutral-11 text-[16px]">🚨 this transaction is irreversible</p>
        <p className="text-neutral-11 font-bold text-[16px]">
          so just to confirm: wanna go ahead and buy the max votes?
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <ButtonV3 colorClass="bg-gradient-vote rounded-[40px]" size={buttonSize} onClick={onConfirm}>
          buy the max votes baby
        </ButtonV3>
        <ButtonV3
          colorClass="bg-transparent border border-neutral-11 rounded-[40px]"
          textColorClass="text-neutral-11"
          size={buttonSize}
          onClick={onCancel}
        >
          wait go back!
        </ButtonV3>
      </div>
    </div>
  );
};

export default DialogMaxVotesAlert;
