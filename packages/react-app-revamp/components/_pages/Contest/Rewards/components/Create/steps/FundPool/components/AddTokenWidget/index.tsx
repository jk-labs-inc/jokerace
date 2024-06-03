/* eslint-disable @next/next/no-img-element */
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { formatBalance } from "@helpers/formatBalance";
import { ChevronDownIcon, RefreshIcon } from "@heroicons/react/outline";
import { FilteredToken } from "@hooks/useTokenList";
import { RainbowKitChain } from "@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitChainContext";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { FundPoolToken, useFundPoolStore } from "../../store";
import FundPoolTokenList from "../List";
import { useSelectedTokenBalanceStore } from "./store";

interface AddTokenWidgetProps {
  selectedToken: FilteredToken | null;
  selectedChain: RainbowKitChain | undefined;
  isTokenSearchModalOpen: boolean;
  onOpenTokenSearchModal?: (isOpen: boolean) => void;
}

const getFormattedBalance = (balance: string) => {
  const parsedBalance = parseFloat(balance);
  if (parsedBalance === 0) return "0";
  if (parsedBalance < 0.001) return "< 0.001";
  return formatBalance(balance);
};

const getTokenSymbol = (
  selectedToken: FilteredToken | null,
  chainNativeCurrencySymbol: string,
  length: "short" | "long",
) => {
  const textLength = length === "short" ? 6 : 20;
  return selectedToken
    ? selectedToken.symbol.length > textLength
      ? `${selectedToken.symbol.substring(0, textLength)}...`
      : selectedToken.symbol
    : chainNativeCurrencySymbol;
};

const AddTokenWidget: FC<AddTokenWidgetProps> = ({
  selectedToken,
  selectedChain,
  isTokenSearchModalOpen,
  onOpenTokenSearchModal,
}) => {
  const { address: userAddress } = useAccount();
  const chainLogo = selectedChain?.iconUrl;
  const chainNativeCurrencySymbol = selectedChain?.nativeCurrency.symbol;
  const chainNativeCurrencyName = selectedChain?.nativeCurrency.name;
  const chainNativeCurrencyDecimals = selectedChain?.nativeCurrency.decimals;
  const chainId = selectedChain?.id;
  const { tokens, setTokens } = useFundPoolStore(state => state);
  const [selectedTokenAmount, setSelectedTokenAmount] = useState<string>("");
  const { selectedTokenBalance, setSelectedTokenBalance } = useSelectedTokenBalanceStore(state => state);
  const isEtherChainNativeCurrency = chainNativeCurrencySymbol === "ETH";
  const {
    data,
    refetch: refetchBalance,
    isSuccess,
  } = useBalance({
    address: userAddress as `0x${string}`,
    token: selectedToken?.address as `0x${string}`,
    chainId: chainId,
    query: {
      select(data) {
        const formatted = formatUnits(data.value, data.decimals);

        return {
          value: formatted,
          decimals: data.decimals,
        };
      },
    },
  });

  useEffect(() => {
    if (data) {
      const tokenAddress = selectedToken?.address || "native";
      const existingToken = tokens.find(token => token.address.toLowerCase() === tokenAddress.toLowerCase());

      if (existingToken) {
        const updatedBalance = (parseFloat(data.value) - parseFloat(existingToken.amount)).toString();
        setSelectedTokenBalance(updatedBalance);
      } else {
        setSelectedTokenBalance(data.value);
      }
    }
  }, [data, selectedToken, tokens, setSelectedTokenBalance]);

  const handleOpenTokenSearchModal = () => {
    onOpenTokenSearchModal?.(!isTokenSearchModalOpen);
  };

  const handleAddToken = () => {
    const tokenToAdd: FundPoolToken = selectedToken
      ? {
          address: selectedToken.address,
          name: selectedToken.name,
          symbol: selectedToken.symbol,
          logoURI: selectedToken.logoURI,
          amount: selectedTokenAmount,
          decimals: data?.decimals ?? 18,
        }
      : {
          address: "native",
          name: chainNativeCurrencyName ?? "",
          symbol: chainNativeCurrencySymbol ?? "",
          logoURI: chainNativeCurrencySymbol === "ETH" ? "/tokens/ether.svg" : "/contest/mona-lisa-moustache.png",
          amount: selectedTokenAmount,
          decimals: chainNativeCurrencyDecimals ?? 18,
        };

    const existingTokenIndex = tokens.findIndex(
      token => token.address.toLowerCase() === tokenToAdd.address.toLowerCase(),
    );
    if (existingTokenIndex >= 0) {
      const updatedTokens = [...tokens];
      const existingToken = updatedTokens[existingTokenIndex];
      const newAmount = (parseFloat(existingToken.amount) + parseFloat(selectedTokenAmount)).toString();
      updatedTokens[existingTokenIndex] = { ...existingToken, amount: newAmount };
      setTokens(updatedTokens);
    } else {
      setTokens([...tokens, tokenToAdd]);
    }

    // Subtract the added amount from the available balance
    const newAvailableBalance = (parseFloat(selectedTokenBalance) - parseFloat(selectedTokenAmount)).toString();

    setSelectedTokenBalance(newAvailableBalance);
    setSelectedTokenAmount("");
  };

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTokenAmount(e.target.value);
  };

  const isTokenAmountValid = (amount: string): boolean => {
    if (amount === "") return false;

    const amountNumber = parseFloat(amount);
    const maxAmount = data ? parseFloat(selectedTokenBalance) : NaN;

    if (isNaN(amountNumber) || amountNumber <= 0) return false;

    if (!isNaN(maxAmount) && amountNumber > maxAmount) return false;

    return true;
  };

  const handleRefreshBalance = () => {
    refetchBalance().then(() => {
      if (data) {
        const updatedBalance = (
          parseFloat(data.value) - tokens.reduce((acc, token) => acc + parseFloat(token.amount), 0)
        ).toString();
        setSelectedTokenBalance(updatedBalance);
      }
    });
  };

  const handleRemoveToken = (address: string) => {
    if (address !== selectedToken?.address) return;

    refetchBalance();
  };

  const handleMaxBalance = () => {
    setSelectedTokenAmount(selectedTokenBalance);
  };

  return (
    <div className="flex flex-col gap-4 md:w-[400px]">
      <ButtonV3
        textColorClass="text-neutral-11 text-[16px] font-normal"
        colorClass="ml-auto rounded-[40px] bg-primary-2"
        isDisabled={!isTokenAmountValid(selectedTokenAmount)}
        onClick={handleAddToken}
        size={ButtonSize.DEFAULT_LARGE}
      >
        + add token
      </ButtonV3>
      <div className="bg-true-black rounded-[32px] flex flex-col items-center justify-center shadow-file-upload">
        <div className="p-6">
          <div className="w-80 md:w-[360px] h-32 rounded-[16px] bg-neutral-2 pr-4 pl-6 pt-2 pb-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-end">
                <Image
                  src={chainLogo?.toString() ?? ""}
                  alt="chain-logo"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    className="text-[32px] w-2/3 text-neutral-11 placeholder-neutral-14 placeholder-bold bg-transparent border-none focus:outline-none"
                    placeholder="0"
                    onChange={onAmountChange}
                    value={selectedTokenAmount}
                  />
                  <div
                    className="flex items-center gap-1 p-1 bg-primary-5 border border-neutral-10 rounded-[10px] cursor-pointer"
                    onClick={handleOpenTokenSearchModal}
                  >
                    {selectedToken ? (
                      <img
                        src={selectedToken?.logoURI ?? ""}
                        alt="tokenLogo"
                        className="rounded-full"
                        width={16}
                        height={16}
                      />
                    ) : isEtherChainNativeCurrency ? (
                      <Image src="/tokens/ether.svg" alt="ether" width={16} height={16} />
                    ) : null}

                    <p className="text-[16px] text-neutral-11 font-bold uppercase">
                      {getTokenSymbol(selectedToken, chainNativeCurrencySymbol ?? "", "short")}
                    </p>
                    <ChevronDownIcon className="w-5 h-5 text-neutral-11" />
                  </div>
                </div>
                <div className="flex gap-2 items-center group">
                  <p className="text-[16px] text-neutral-14 font-bold">
                    balance: {getFormattedBalance(selectedTokenBalance)}{" "}
                    <span className="uppercase">
                      {getTokenSymbol(selectedToken, chainNativeCurrencySymbol ?? "", "long")}
                    </span>
                  </p>

                  {parseFloat(selectedTokenBalance) > 0 ? (
                    <div
                      className="w-12 text-center rounded-[10px] border items-center border-positive-11 hover:border-2 cursor-pointer"
                      onClick={handleMaxBalance}
                    >
                      <p className="text-[12px] text-positive-11 infinite-submissions uppercase">max</p>
                    </div>
                  ) : null}
                  <RefreshIcon
                    className="w-5 h-5 text-neutral-14 hover:text-neutral-11 transition-all cursor-pointer opacity-0 group-hover:opacity-100 duration-300"
                    onClick={handleRefreshBalance}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {tokens.length > 0 ? <FundPoolTokenList tokens={tokens} onRemoveToken={handleRemoveToken} /> : null}
      </div>
    </div>
  );
};

export default AddTokenWidget;
