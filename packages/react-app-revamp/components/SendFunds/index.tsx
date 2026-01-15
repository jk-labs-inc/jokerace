import TokenSearchModalERC20MultiStep from "@components/TokenSearchModal/MultiStep";
import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import { getWagmiConfig } from "@getpara/evm-wallet-connectors";
import { erc20ChainDropdownOptions } from "@helpers/tokens";
import { useSendToken } from "@hooks/useSendToken";
import { FilteredToken } from "@hooks/useTokenList";
import { useWallet } from "@hooks/useWallet";
import { switchChain } from "@wagmi/core";
import { FC, useMemo, useState } from "react";

interface SendFundsProps {
  isOpen: boolean;
  onClose: () => void;
  recipientAddress?: string;
}

const SendFunds: FC<SendFundsProps> = ({ isOpen, onClose, recipientAddress }) => {
  const { chain: currentChain } = useWallet();
  const [chainId, setChainId] = useState<number>(currentChain?.id ?? 1);
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

  const handleSubmitTransfer = async (data: { token: FilteredToken; recipient: string; amount: string }) => {
    if (!recipientAddress) {
      toastError({
        message: "recipient address is required",
      });
      return;
    }

    if (!data.token.balance || data.token.balance === 0) {
      toastError({
        message: "insufficient token balance",
      });
      return;
    }

    try {
      await sendToken(data.token, chainId, data.recipient, data.amount);
    } catch (error) {
      console.error("Failed to send token:", error);
    }
  };

  const handleSelectChain = async (chain: string) => {
    const chainId = chains.find(c => c.name.toLowerCase() === chain.toLowerCase())?.id;
    if (chainId) {
      await switchChain(getWagmiConfig(), { chainId });
      setChainId(chainId);
    }
  };

  return (
    <TokenSearchModalERC20MultiStep
      chains={arrangedChainOptions}
      isOpen={isOpen}
      onClose={onClose}
      onSelectChain={handleSelectChain}
      onSubmitTransfer={handleSubmitTransfer}
    />
  );
};

export default SendFunds;
