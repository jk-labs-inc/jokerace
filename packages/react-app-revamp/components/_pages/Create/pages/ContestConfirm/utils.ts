import { toastInfo } from "@components/UI/Toast";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";

const isCoinbaseWallet = (wallet: string) => {
  return wallet.toLowerCase().includes("coinbase");
};

const isEthereumMainnet = (chainId: number) => {
  return chainId === mainnet.id;
};

const displayCoinbaseWalletWarning = () => {
  return toastInfo("coinbase wallet is not supported for creating a contest", "note: retry with a different wallet");
};

export { isCoinbaseWallet, isEthereumMainnet, displayCoinbaseWalletWarning };
