import { toastInfo } from "@components/UI/Toast";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";

const FORBIDDEN_WALLETS = ["coinbase"];

const isWalletForbidden = (wallet: string) => {
  return FORBIDDEN_WALLETS.some(forbiddenWallet => wallet.toLowerCase().includes(forbiddenWallet));
};

const isEthereumMainnet = (chainId: number) => {
  return chainId === mainnet.id;
};

const displayCoinbaseWalletWarning = () => {
  return toastInfo("coinbase wallet is not supported for creating a contest", "note: retry with a different wallet");
};

export { isWalletForbidden, isEthereumMainnet, displayCoinbaseWalletWarning };
