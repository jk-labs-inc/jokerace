import { erc20ChainDropdownOptions } from "@components/_pages/Create/components/RequirementsSettings/config";
import TokenSearchModal, { TokenSearchModalType } from "@components/TokenSearchModal";
import { toastError } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import { useSendToken } from "@hooks/useSendToken";
import { FilteredToken } from "@hooks/useTokenList";
import { switchChain } from "@wagmi/core";
import { FC, useMemo, useState } from "react";
import { useAccount } from "wagmi";

interface SendFundsProps {
  isOpen: boolean;
  onClose: () => void;
  recipientAddress?: string;
}

const SendFunds: FC<SendFundsProps> = ({ isOpen, onClose, recipientAddress }) => {
  const { chainId: currentChainId } = useAccount();
  const [chainId, setChainId] = useState<number>(currentChainId ?? 1);
  const { sendToken } = useSendToken({
    onSuccess: () => {
      onClose();
    },
  });

  const arrangedChainOptions = useMemo(() => {
    if (!chainId) return erc20ChainDropdownOptions;

    const currentChain = chains.find(c => c.id === chainId)?.name.toLowerCase();
    if (!currentChain) return erc20ChainDropdownOptions;

    const currentChainOption = erc20ChainDropdownOptions.find(
      option => option.value.toLowerCase() === currentChain.toLowerCase(),
    );

    if (!currentChainOption) return erc20ChainDropdownOptions;

    return [
      currentChainOption,
      ...erc20ChainDropdownOptions.filter(option => option.value.toLowerCase() !== currentChain.toLowerCase()),
    ];
  }, [chainId]);

  const handleSelectToken = async (token: FilteredToken) => {
    if (!recipientAddress) {
      toastError("recipient address is required");
      return;
    }

    if (!token.balance || token.balance === 0) {
      toastError("insufficient token balance");
      return;
    }

    try {
      await sendToken(token, chainId, recipientAddress, token.balance.toString());
    } catch (error) {
      console.error("Failed to send token:", error);
    }
  };

  const handleSelectChain = async (chain: string) => {
    const chainId = chains.find(c => c.name.toLowerCase() === chain.toLowerCase())?.id;
    if (chainId) {
      await switchChain(config, { chainId });
      setChainId(chainId);
    }
  };

  return (
    <TokenSearchModal
      type={TokenSearchModalType.ERC20}
      chains={arrangedChainOptions}
      isOpen={isOpen}
      onClose={onClose}
      onSelectToken={handleSelectToken}
      onSelectChain={handleSelectChain}
    />
  );
};

export default SendFunds;
