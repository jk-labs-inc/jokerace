import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { useMediaQuery } from "react-responsive";

interface DialogMaxVotesAlertProps {
  token: string;
  totalCost: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
}

const DialogMaxVotesAlert: FC<DialogMaxVotesAlertProps> = ({
  token,
  totalCost,
  onConfirm,
  onCancel,
  isMobile = false,
  isOpen = true,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current) {
        onCancel?.();
      }
    },
    [onCancel],
  );

  const content = (
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
        <ButtonV3
          colorClass="bg-gradient-vote rounded-[40px]"
          size={isMobile || isSmallScreen ? ButtonSize.FULL : ButtonSize.EXTRA_LARGE_LONG_MOBILE}
          onClick={onConfirm}
        >
          buy the max votes baby
        </ButtonV3>
        <ButtonV3
          colorClass="bg-transparent border border-neutral-11 rounded-[40px]"
          textColorClass="text-neutral-11"
          size={isMobile || isSmallScreen ? ButtonSize.FULL : ButtonSize.EXTRA_LARGE_LONG_MOBILE}
          onClick={onCancel}
        >
          wait go back!
        </ButtonV3>
      </div>
    </div>
  );

  if (isMobile) {
    if (typeof window === "undefined") return null;

    return ReactDOM.createPortal(
      <div
        ref={backdropRef}
        className={`fixed inset-0 z-50 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={handleBackdropClick}
      >
        <div className="absolute inset-0 bg-neutral-8 bg-opacity-40 pointer-events-none" />
        <div
          className={`absolute animate-appear inset-x-0 bottom-0 bg-true-black 
          border-t border-neutral-9 rounded-t-[40px] p-6 pb-12 
          ${isOpen ? "translate-y-0" : "translate-y-full"} transition-transform duration-300`}
        >
          {content}
        </div>
      </div>,
      document.body,
    );
  }

  return content;
};

export default DialogMaxVotesAlert;
