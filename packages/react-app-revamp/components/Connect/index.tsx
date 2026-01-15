import { useLogout, useModal, useWallet } from "@getpara/react-sdk-lite";
import { FC } from "react";
import { useConnection } from "wagmi";
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
  const { isConnected } = useConnection();
  const { data } = useWallet();
  const { logoutAsync } = useLogout();
  const { openModal } = useModal();

  const handleDisconnect = async () => {
    try {
      await logoutAsync({
        clearPregenWallets: false, // Keep pregenerated wallets
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!isConnected || !data?.address) {
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
          address={data.address}
          displayName={`${data.address.slice(0, 6)}...${data.address.slice(-4)}`}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
};
