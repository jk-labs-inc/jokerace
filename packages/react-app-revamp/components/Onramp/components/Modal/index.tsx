import Onramp from "@components/Onramp";
import DialogModalV4 from "@components/UI/DialogModalV4";
import { FC, useState } from "react";

interface OnrampModalProps {
  chain: string;
  asset: string;
  isOpen: boolean;
  onClose: () => void;
}

const OnrampModal: FC<OnrampModalProps> = ({ chain, asset, isOpen, onClose }) => {
  return (
    <DialogModalV4 isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col bg-true-black z-40 gap-4 py-6 md:py-16 px-6 md:pl-32 md:pr-16">
        <div className="hidden md:flex justify-between items-start">
          <img
            src="/modal/modal_close.svg"
            width={33}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer ml-auto"
            onClick={onClose}
          />
        </div>
        <Onramp className="md:w-[400px]" chain={chain} asset={asset} showBackButton={false} />
      </div>
    </DialogModalV4>
  );
};

export default OnrampModal;
