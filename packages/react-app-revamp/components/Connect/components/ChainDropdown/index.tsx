import Dropdown, { Option } from "@components/UI/Dropdown";
import { chains } from "@config/wagmi";
import { switchChain } from "@wagmi/core";
import { config } from "@config/wagmi";
import { useAccount } from "wagmi";
import { FC, useState, useMemo } from "react";
import { Chain } from "@rainbow-me/rainbowkit";

const ChainDropdown: FC = () => {
  const { chain: currentChain } = useAccount();
  const [resetKey, setResetKey] = useState(0);

  const chainOptions = useMemo<Option[]>(
    () =>
      chains.map(chain => {
        const chainWithIcon = chain as Chain & { iconUrl?: string };
        return {
          label: chain.name,
          value: chain.id.toString(),
          image: chainWithIcon.iconUrl,
        };
      }),
    [],
  );

  const handleChainSwitch = async (chainId: string) => {
    const targetChain = chains.find(chain => chain.id.toString() === chainId) as Chain & { iconUrl?: string };

    if (!targetChain) return;

    const publicRpcUrls = targetChain.rpcUrls.public.http.filter((url): url is string => typeof url === "string");

    try {
      await switchChain(config, {
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
    <Dropdown
      key={`${currentChain?.id ?? "no-chain"}-${resetKey}`}
      options={chainOptions}
      defaultValue={currentChain?.name ?? chains[0].name}
      onChange={handleChainSwitch}
      menuButtonWidth="w-auto"
      menuItemsWidth="w-52"
    />
  );
};

export default ChainDropdown;
