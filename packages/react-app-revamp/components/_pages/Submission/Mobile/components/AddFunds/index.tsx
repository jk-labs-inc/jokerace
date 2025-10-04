import AddFunds from "@components/AddFunds";
import { FC, useRef } from "react";
import ReactDOM from "react-dom";

interface SubmissionPageMobileAddFundsProps {
  isOpen: boolean;
  onClose: () => void;
  chain: string;
  asset: string;
}

const SubmissionPageMobileAddFunds: FC<SubmissionPageMobileAddFundsProps> = ({ isOpen, onClose, chain, asset }) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };
  return ReactDOM.createPortal(
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-50 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-neutral-8/40 pointer-events-none" />
      <div
        className={`absolute animate-appear inset-x-0 bottom-0 bg-true-black 
              border-t border-neutral-9 rounded-t-[40px] p-6 pb-4
              ${isOpen ? "translate-y-0" : "translate-y-full"} transition-transform duration-300`}
      >
        <AddFunds chain={chain} asset={asset} showBackButton={false} />
      </div>
    </div>,
    document.body,
  );
};

export default SubmissionPageMobileAddFunds;
