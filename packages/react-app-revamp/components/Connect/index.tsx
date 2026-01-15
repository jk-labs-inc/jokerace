import { useModal } from "@getpara/react-sdk-lite";
import { useWallet } from "@hooks/useWallet";
import { FC } from "react";
import AccountDropdown from "./components/AccountDropdown";
import ChainDropdown from "./components/ChainDropdown";

interface DisplayOptions {
  showChainName?: boolean;
  onlyChainSwitcher?: boolean;
}

interface ConnectButtonProps {
  displayOptions?: DisplayOptions;
}

export const ConnectButtonCustom: FC<ConnectButtonProps> = ({ displayOptions = {} }) => {
  const { onlyChainSwitcher = false } = displayOptions;
  const { isConnected, userAddress, disconnect } = useWallet();
  const { openModal } = useModal();

  if (!isConnected || !userAddress) {
    return (
      <button
        onClick={() => openModal()}
        type="button"
        className="w-48 h-10 text-center bg-gradient-create rounded-[40px] text-true-black font-bold text-[16px]"
      >
        connect wallet
      </button>
    );
  }

  return (
    <div className="flex gap-3">
      <ChainDropdown />
      {!onlyChainSwitcher && (
        <AccountDropdown
          address={userAddress}
          displayName={`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
          onDisconnect={disconnect}
        />
      )}
    </div>
  );
};
