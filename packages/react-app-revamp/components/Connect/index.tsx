import { useConnection, useDisconnect } from "wagmi";
import { FC } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import ChainDropdown from "./components/ChainDropdown";
import AccountDropdown from "./components/AccountDropdown";

interface DisplayOptions {
  showChainName?: boolean;
  onlyChainSwitcher?: boolean;
}

interface ConnectButtonProps {
  displayOptions?: DisplayOptions;
}

export const ConnectButtonCustom: FC<ConnectButtonProps> = ({ displayOptions = {} }) => {
  const { onlyChainSwitcher = false } = displayOptions;
  const { address, isConnected } = useConnection();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const handleDisconnect = () => {
    disconnect();
  };

  if (!isConnected || !address) {
    return (
      <button
        onClick={openConnectModal}
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
          address={address}
          displayName={`${address.slice(0, 6)}...${address.slice(-4)}`}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
};
