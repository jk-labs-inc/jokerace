import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import Image from "next/image";
import { FC } from "react";

interface CommentFormInputSubmitButtonProps {
  allowSend: boolean;
  isAdding: boolean;
  isMobile: boolean;
  isConnected: boolean;
  isUserOnCorrectNetwork: boolean;
  onSend?: () => void;
  onSwitchNetwork?: () => void;
  onConnect?: () => void;
}

const CommentFormInputSubmitButton: FC<CommentFormInputSubmitButtonProps> = ({
  allowSend,
  isAdding,
  isMobile,
  isConnected,
  isUserOnCorrectNetwork,
  onSend,
  onSwitchNetwork,
  onConnect,
}) => {
  const onSendFromMobile = () => {
    if (!isConnected) {
      onConnect?.();
    } else if (!isUserOnCorrectNetwork) {
      onSwitchNetwork?.();
    } else {
      onSend?.();
    }
  };

  return isMobile ? (
    <Image
      className={`ml-auto pr-1 ${allowSend ? "filter-send-commment-icon" : ""} ${
        isAdding ? "filter-send-commment-icon opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
      src="/comments/send.svg"
      alt="send"
      width={32}
      height={32}
      onClick={onSendFromMobile}
    />
  ) : !isConnected ? (
    <ButtonV3 colorClass="bg-gradient-vote rounded-[40px]" size={ButtonSize.SMALL_LONG} onClick={onConnect}>
      {isMobile ? "connect" : "connect wallet"}
    </ButtonV3>
  ) : !isUserOnCorrectNetwork ? (
    <ButtonV3 colorClass="bg-gradient-create rounded-[40px]" size={ButtonSize.SMALL_LONG} onClick={onSwitchNetwork}>
      {isMobile ? "switch chain" : "switch network"}
    </ButtonV3>
  ) : (
    <Image
      className={`ml-auto pr-1 transition-all duration-300 ${allowSend ? "filter-send-commment-icon" : ""} ${
        isAdding ? "filter-send-commment-icon opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
      src="/comments/send.svg"
      alt="send"
      width={32}
      height={32}
      onClick={onSend}
    />
  );
};

export default CommentFormInputSubmitButton;
