import { Option } from "@components/UI/Dropdown";
import { chains, ChainWithIcon } from "@config/wagmi";
import { getWagmiConfig } from "@getpara/evm-wallet-connectors";
import { switchChain } from "@wagmi/core";
import { FC, useState } from "react";
import { useConnection } from "wagmi";
import ConnectDropdown from "../Dropdown";

const chainOptions: Option[] = chains.map(chain => {
  return {
    label: chain.name,
    value: chain.id.toString(),
    image: chain.iconUrl,
  };
});

const ChainDropdown: FC = () => {
  const { chain: currentChain } = useConnection();
  const [resetKey, setResetKey] = useState(0);

  const handleChainSwitch = async (chainId: string) => {
    const targetChain = chains.find(chain => chain.id.toString() === chainId);

    if (!targetChain) return;

    const publicRpcUrls = targetChain.rpcUrls.public.http.filter((url): url is string => typeof url === "string");

    try {
      await switchChain(getWagmiConfig(), {
        chainId: targetChain.id,
        addEthereumChainParameter: {
          ...targetChain,
          rpcUrls: publicRpcUrls,
        },
      });
    } catch (error) {
      console.error("Failed to switch chain:", error);
      setResetKey(prev => prev + 1);
    }
  };

  return (
    <ConnectDropdown
      key={`${currentChain?.id ?? "no-chain"}-${resetKey}`}
      options={chainOptions}
      defaultValue={currentChain?.name ?? chainOptions[0].label}
      onChange={handleChainSwitch}
      menuButtonWidth="w-auto"
      menuItemsWidth="w-52"
      menuItemsMaxHeight="max-h-90"
    />
  );
};

export default ChainDropdown;
