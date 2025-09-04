import DialogModalV4 from "@components/UI/DialogModalV4";
import { FilteredToken } from "@hooks/useTokenList";
import { FC, useCallback } from "react";
import TokenSearchModalERC20 from "./ERC20";
import { Option } from "./types";

interface TokenSearchModalProps {
  chains: Option[];
  isOpen: boolean;
  hideChains?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  onSelectToken?: (token: FilteredToken) => void;
  onSelectChain?: (chain: string) => void;
}

const TokenSearchModal: FC<TokenSearchModalProps> = ({
  hideChains = false,
  isOpen,
  setIsOpen,
  chains,
  onSelectToken,
  onClose,
  onSelectChain,
}) => {
  const handleClose = useCallback(() => {
    setIsOpen?.(false);
    onClose?.();
  }, [onClose, setIsOpen]);

  return (
    <DialogModalV4 isOpen={isOpen} onClose={handleClose} width="w-full" lgWidth="lg:max-w-[552px]">
      <div className="flex flex-col gap-8 py-6 px-4">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">select a token</p>
          <img
            src="/modal/modal_close.svg"
            alt="close"
            width={39}
            height={33}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <div className="bg-primary-5 h-[2px]" />
        <TokenSearchModalERC20
          chains={chains}
          onSelectToken={onSelectToken}
          onSelectChain={onSelectChain}
          hideChains={hideChains}
        />
      </div>
    </DialogModalV4>
  );
};

export default TokenSearchModal;
