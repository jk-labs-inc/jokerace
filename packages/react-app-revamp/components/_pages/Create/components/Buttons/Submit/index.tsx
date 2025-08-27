import AddFundsModal from "@components/AddFunds/components/Modal";
import ButtonV3, { ButtonSize, ButtonType } from "@components/UI/ButtonV3";
import { usePreviousStep } from "@components/_pages/Create/hooks/usePreviousStep";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { FC, MouseEventHandler, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount, useBalance } from "wagmi";
import MobileBottomButton from "../Mobile";

interface CreateContestButtonProps {
  step: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisabled?: boolean;
}

enum CreateButtonText {
  CREATE = "create contest",
  CONNECT_WALLET = "connect wallet",
  ADD_FUNDS = "add funds",
}

const CreateContestButton: FC<CreateContestButtonProps> = ({ step, onClick, isDisabled }) => {
  const { errors } = useDeployContestStore(state => state);
  const { isConnected, address, chainId, chain } = useAccount();
  const [shake, setShake] = useState(false);
  const onPreviousStep = usePreviousStep();
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });
  const [showAddFunds, setShowAddFunds] = useState(false);
  const { data: balance } = useBalance({
    address,
    chainId,
  });
  const chainCurrencyDecimals = chain?.nativeCurrency.decimals || 18;
  const DUST_THRESHOLD = BigInt(10) ** BigInt(chainCurrencyDecimals - 6);
  const insufficientBalance = balance && (balance.value === BigInt(0) || balance.value < DUST_THRESHOLD);
  const [createButtonText, setCreateButtonText] = useState(CreateButtonText.CREATE);
  const chainNativeCurrency = chain?.nativeCurrency.symbol;

  useEffect(() => {
    if (insufficientBalance && isConnected) {
      setCreateButtonText(CreateButtonText.ADD_FUNDS);
    } else if (isConnected) {
      setCreateButtonText(CreateButtonText.CREATE);
    } else {
      setCreateButtonText(CreateButtonText.CONNECT_WALLET);
    }
  }, [insufficientBalance, isConnected]);

  useEffect(() => {
    // If there's an error for the current step, shake the button
    if (errors.find(error => error.step === step - 1)) {
      setShake(true);
    } else {
      setShake(false);
    }
  }, [errors, step]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If there's an error, shake the button
    if (errors.find(error => error.step === step - 1)) {
      setShake(true);
    }

    if (createButtonText === CreateButtonText.ADD_FUNDS) {
      setShowAddFunds(true);
    } else if (onClick) {
      onClick(e);
    }
  };

  if (isMobileOrTablet)
    return (
      <MobileBottomButton>
        <div className={`flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2   px-8`}>
          <p className="text-[20px] text-neutral-11" onClick={onPreviousStep}>
            back
          </p>
          <ButtonV3
            onClick={handleClick}
            colorClass="text-[20px] bg-gradient-create rounded-[15px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            {isConnected ? (insufficientBalance ? "add funds" : "create") : "connect wallet"}
          </ButtonV3>
        </div>
      </MobileBottomButton>
    );

  return (
    <div className="flex gap-4 items-start pb-5 md:pb-0">
      <div className={`flex flex-col items-center gap-4`}>
        <ButtonV3
          isDisabled={isDisabled}
          colorClass={`bg-gradient-create text-[20px] rounded-[10px] font-bold ${
            shake ? "animate-shake-top" : ""
          }  text-true-black`}
          size={ButtonSize.LARGE}
          type={ButtonType.TX_ACTION}
          onClick={handleClick}
        >
          {createButtonText}
        </ButtonV3>

        <div
          className="hidden lg:flex items-center gap-[2px] md:-ml-[15px] cursor-pointer group"
          onClick={onPreviousStep}
        >
          <div className="transition-transform duration-200 group-hover:-translate-x-1">
            <img src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-px" />
          </div>
          <p className="text-[16px]">back</p>
        </div>
      </div>
      <AddFundsModal
        chain={chain?.name.toLowerCase() ?? ""}
        asset={chainNativeCurrency ?? ""}
        isOpen={showAddFunds}
        onClose={() => setShowAddFunds(false)}
      />
    </div>
  );
};

export default CreateContestButton;
