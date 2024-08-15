import ContestParamsSplitFeeDestination from "@components/_pages/Create/pages/ContestMonetization/components/Charge/components/SplitFeeDestination";
import DialogModalV4 from "@components/UI/DialogModalV4";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { addressRegex } from "@helpers/regex";
import { useContestStore } from "@hooks/useContest/store";
import { useCreatorSplitDestination } from "@hooks/useCreatorSplitDestination";
import { JK_LABS_SPLIT_DESTINATION_DEFAULT } from "@hooks/useDeployContest";
import { Charge, SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { switchChain } from "@wagmi/core";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { useAccount } from "wagmi";

interface ContestParamsEarningsModalProps {
  charge: Charge;
  isOpen: boolean;
  onClose: (value: boolean) => void;
}

const ContestParamsEarningsModal: FC<ContestParamsEarningsModalProps> = ({ charge, isOpen, onClose }) => {
  const pathname = usePathname();
  const { chainName: contestChainName } = extractPathSegments(pathname);
  const contestChainId = chains.find(chain => chain.name.toLowerCase() === contestChainName.toLowerCase())?.id;
  const { address: userAddress, chainId } = useAccount();
  const isUserOnCorrectChain = contestChainId === chainId;
  const { rewardsModuleAddress } = useContestStore(state => state);
  const [splitFeeDestinationError, setSplitFeeDestinationError] = useState("");
  const { setCreatorSplitDestination, isLoading, isConfirmed } = useCreatorSplitDestination();
  const [localCharge, setLocalCharge] = useState<Charge>(charge);

  const handleSplitFeeDestinationTypeChange = (type: SplitFeeDestinationType) => {
    let newAddress = charge.splitFeeDestination.address;

    switch (type) {
      case SplitFeeDestinationType.RewardsPool:
        newAddress = rewardsModuleAddress;
        break;
      case SplitFeeDestinationType.AnotherWallet:
        newAddress = "";
        break;
      case SplitFeeDestinationType.NoSplit:
        newAddress = JK_LABS_SPLIT_DESTINATION_DEFAULT;
        break;
      case SplitFeeDestinationType.CreatorWallet:
        newAddress = userAddress;
    }

    const newSplitFeeDestination = {
      ...charge.splitFeeDestination,
      type,
      address: newAddress,
    };

    const isValidAddress = addressRegex.test(newAddress ?? "");
    const error = type === SplitFeeDestinationType.AnotherWallet && !isValidAddress;

    setLocalCharge?.({
      ...charge,
      splitFeeDestination: newSplitFeeDestination,
      error,
    });
  };

  const handleSplitFeeDestinationAddressChange = (address: string) => {
    const isValidAddress = addressRegex.test(address);
    const newSplitFeeDestination = {
      ...charge.splitFeeDestination,
      type: SplitFeeDestinationType.AnotherWallet,
      address,
    };

    setSplitFeeDestinationError(isValidAddress ? "" : "invalid address");

    setLocalCharge?.({
      ...charge,
      splitFeeDestination: newSplitFeeDestination,
      error: !isValidAddress,
    });
  };

  const onSaveHandler = async () => {
    if (!contestChainId) return;

    if (!isUserOnCorrectChain) {
      await switchChain(config, { chainId: contestChainId });
    }

    setCreatorSplitDestination(localCharge.splitFeeDestination);
  };

  return (
    <DialogModalV4 isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-8 md:gap-20 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">edit earnings</p>
          <Image
            src="/modal/modal_close.svg"
            width={39}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer"
            onClick={() => onClose(true)}
          />
        </div>
        <ContestParamsSplitFeeDestination
          splitFeeDestination={localCharge.splitFeeDestination}
          splitFeeDestinationError={splitFeeDestinationError}
          includeRewardsPool={rewardsModuleAddress !== ""}
          rewardsModuleAddress={rewardsModuleAddress}
          onSplitFeeDestinationTypeChange={handleSplitFeeDestinationTypeChange}
          onSplitFeeDestinationAddressChange={handleSplitFeeDestinationAddressChange}
        />
        <button
          disabled={(isLoading && !isConfirmed) || localCharge.error}
          className="mt-4 bg-gradient-purple rounded-[40px] w-80 h-10 text-center text-true-black text-[16px] font-bold hover:opacity-80 transition-opacity duration-300 ease-in-out"
          onClick={onSaveHandler}
        >
          save
        </button>
      </div>
    </DialogModalV4>
  );
};

export default ContestParamsEarningsModal;
