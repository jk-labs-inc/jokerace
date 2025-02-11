import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC } from "react";

interface CommentFormInputSubmitButtonProps {
  allowSend: boolean;
  isAdding: boolean;
  isMobile: boolean;
  isConnected: boolean;
  onSend?: () => void;
  onConnect?: () => void;
}

const CommentFormInputSubmitButton: FC<CommentFormInputSubmitButtonProps> = ({
  allowSend,
  isAdding,
  isMobile,
  isConnected,
  onSend,
  onConnect,
}) => {
  const onSendFromMobile = () => {
    if (!isConnected) {
      onConnect?.();
    } else {
      onSend?.();
    }
  };

  return isMobile ? (
    <img
      className={`ml-auto pr-1 ${allowSend ? "filter-send-commment-icon" : ""} ${
        isAdding ? "filter-send-commment-icon opacity-50 pointer-events-none" : "cursor-pointer"
      }`}
      src="/comments/send.svg"
      alt="send"
      width={32}
      height={32}
      onClick={onSendFromMobile}
    />
  ) : (
    <img
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
