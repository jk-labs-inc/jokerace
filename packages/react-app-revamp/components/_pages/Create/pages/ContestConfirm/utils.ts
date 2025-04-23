import { toastError, toastInfo } from "@components/UI/Toast";
import { ErrorToastType } from "@components/UI/Toast/components/Error";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";

const FORBIDDEN_WALLETS = ["coinbase"];

const isWalletForbidden = (wallet: string) => {
  return FORBIDDEN_WALLETS.some(forbiddenWallet => wallet.toLowerCase().includes(forbiddenWallet));
};

const isEthereumMainnet = (chainId: number) => {
  return chainId === mainnet.id;
};

const displayCoinbaseWalletWarning = () => {
  return toastError("coinbase wallet is not supported for creating a contest.", "", ErrorToastType.SIMPLE);
};

export { isWalletForbidden, isEthereumMainnet, displayCoinbaseWalletWarning };
