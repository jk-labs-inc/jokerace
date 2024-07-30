import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { FC } from "react";

interface DisplayOptions {
  showChainName?: boolean;
  onlyChainSwitcher?: boolean;
}

interface ConnectButtonCustomProps {
  displayOptions?: DisplayOptions;
  isConnectWalletPurple?: boolean;
}

export const ConnectButtonCustom: FC<ConnectButtonCustomProps> = ({ displayOptions = {}, isConnectWalletPurple }) => {
  const { showChainName = true, onlyChainSwitcher = false } = displayOptions;

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className={`w-40 h-10 text-center ${isConnectWalletPurple ? "bg-gradient-create" : "bg-primary-10"} rounded-2xl text-true-black font-bold text-[20px]`}
                  >
                    connect wallet
                  </button>
                );
              }
              return (
                <div className="flex gap-3">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-1 py-2 px-3 bg-neutral-2 rounded-2xl text-[18px] font-bold"
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        className="w-6 h-6 overflow-hidden mr-1"
                        style={{
                          background: chain.iconBackground,
                          borderRadius: 999,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image width={24} height={24} alt={chain.name ?? "Chain icon"} src={chain.iconUrl} />
                        )}
                      </div>
                    )}
                    {showChainName && <p>{chain.name}</p>}
                    <ChevronDownIcon className="w-6" />
                  </button>
                  {!onlyChainSwitcher && (
                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="flex items-center py-2 px-3 bg-neutral-2 rounded-2xl font-bold text-[18px]"
                    >
                      {account.displayName}
                      <ChevronDownIcon className="w-6 ml-1" />
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
