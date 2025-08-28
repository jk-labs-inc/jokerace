import MobileBottomButton from "@components/_pages/Create/components/Buttons/Mobile";
import AddFundsModal from "@components/AddFunds/components/Modal";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount, useBalance } from "wagmi";
import { useCreateRewardsStore } from "../../../store";

interface CreateRewardsSubmitButtonProps {
  step: number;
  onSubmit?: () => void;
}

enum CreateButtonText {
  CREATE = "create pool",
  ADD_FUNDS = "add funds",
}

const CreateRewardsSubmitButton: FC<CreateRewardsSubmitButtonProps> = ({ step, onSubmit }) => {
  const { isConnected, address, chainId, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId,
  });
  const chainCurrencyDecimals = chain?.nativeCurrency.decimals || 18;
  const DUST_THRESHOLD = BigInt(10) ** BigInt(chainCurrencyDecimals - 6);
  const insufficientBalance = balance && (balance.value === BigInt(0) || balance.value < DUST_THRESHOLD);
  const { setStep } = useCreateRewardsStore(state => state);
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [createButtonText, setCreateButtonText] = useState(CreateButtonText.CREATE);
  const chainNativeCurrency = chain?.nativeCurrency.symbol;

  useEffect(() => {
    if (insufficientBalance && isConnected) {
      setCreateButtonText(CreateButtonText.ADD_FUNDS);
    } else if (isConnected) {
      setCreateButtonText(CreateButtonText.CREATE);
    }
  }, [insufficientBalance, isConnected]);

  const onBackHandler = (step: number) => {
    setStep(step - 1);
  };

  const handleClick = () => {
    if (createButtonText === CreateButtonText.ADD_FUNDS) {
      setShowAddFunds(true);
    } else {
      onSubmit?.();
    }
  };

  if (isMobileOrTablet) {
    return (
      <MobileBottomButton>
        <div className={`flex flex-row items-center h-12 justify-between border-t-neutral-2 border-t-2 px-8`}>
          <p className="text-[20px] text-neutral-11" onClick={() => onBackHandler(step)}>
            back
          </p>
          <ButtonV3
            size={ButtonSize.DEFAULT_LONG}
            onClick={handleClick}
            colorClass="text-[20px] bg-gradient-purple rounded-[15px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            {createButtonText}
          </ButtonV3>
        </div>
      </MobileBottomButton>
    );
  }

  return (
    <div className="flex gap-4 items-start">
      <div className="flex flex-col gap-2 items-center">
        <ButtonV3
          colorClass="text-[20px] bg-gradient-purple rounded-[40px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
          size={ButtonSize.EXTRA_LARGE_LONG}
          onClick={handleClick}
        >
          {createButtonText}
        </ButtonV3>
        <div
          className="hidden lg:flex items-center gap-[5px] -ml-[15px] cursor-pointer group"
          onClick={() => onBackHandler(step)}
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

export default CreateRewardsSubmitButton;
