import DialogModalV4 from "@components/UI/DialogModalV4";
import { FilteredToken } from "@hooks/useTokenList";
import { FC, useState } from "react";
import TokenSearchModalERC20 from "../ERC20";
import { Option } from "../types";
import TokenSearchModalERC20MultiStepForm from "./components/Form";

interface TokenSearchModalERC20MultiStepProps {
  chains: Option[];
  isOpen: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  onSelectChain?: (chain: string) => void;
  onSubmitTransfer?: (data: { token: FilteredToken; recipient: string; amount: string }) => void;
}

enum STEPS {
  SELECT_TOKEN = 1,
  TRANSFER_DETAILS = 2,
}

const TokenSearchModalERC20MultiStep: FC<TokenSearchModalERC20MultiStepProps> = ({
  isOpen,
  setIsOpen,
  chains,
  onClose,
  onSelectChain,
  onSubmitTransfer,
}) => {
  const [currentStep, setCurrentStep] = useState(STEPS.SELECT_TOKEN);
  const [selectedToken, setSelectedToken] = useState<FilteredToken | null>(null);

  const handleClose = () => {
    setIsOpen?.(false);
    onClose?.();
    setCurrentStep(STEPS.SELECT_TOKEN);
    setSelectedToken(null);
  };

  const handleTokenSelect = (token: FilteredToken) => {
    setSelectedToken(token);
    setCurrentStep(STEPS.TRANSFER_DETAILS);
  };

  const handleBack = () => {
    setCurrentStep(STEPS.SELECT_TOKEN);
  };

  const handleSubmitTransfer = (recipient: string, amount: string) => {
    if (selectedToken && onSubmitTransfer) {
      onSubmitTransfer({
        token: selectedToken,
        recipient,
        amount,
      });
      handleClose();
    }
  };

  return (
    <DialogModalV4 isOpen={isOpen} onClose={handleClose} width="w-full" lgWidth="lg:max-w-[552px]">
      <div className="flex flex-col gap-8 py-6 px-4">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">
            {currentStep === STEPS.SELECT_TOKEN ? (
              "select a token"
            ) : (
              <>
                send <span className="uppercase">{selectedToken?.symbol}</span>
              </>
            )}
          </p>
          <img
            src="/modal/modal_close.svg"
            alt="close"
            width={25}
            height={22}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <div className="bg-primary-5 h-[2px]" />

        {currentStep === STEPS.SELECT_TOKEN ? (
          <TokenSearchModalERC20 chains={chains} onSelectToken={handleTokenSelect} onSelectChain={onSelectChain} />
        ) : (
          <TokenSearchModalERC20MultiStepForm
            token={selectedToken!}
            onBack={handleBack}
            onSubmit={handleSubmitTransfer}
          />
        )}
      </div>
    </DialogModalV4>
  );
};

export default TokenSearchModalERC20MultiStep;
