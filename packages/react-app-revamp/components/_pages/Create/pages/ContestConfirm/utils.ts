import { toastError } from "@components/UI/Toast";
import { ErrorToastType } from "@components/UI/Toast/components/Error";
import { mainnet } from "@config/wagmi/custom-chains/mainnet";

const FORBIDDEN_WALLETS: Record<string, string> = {
  coinbase: "Coinbase Wallet",
  "xyz.abs.privy": "Abstract Global Wallet",
};

const isWalletForbidden = (wallet: string) => {
  const lowerWallet = wallet.toLowerCase();
  return Object.keys(FORBIDDEN_WALLETS).some(key => lowerWallet.includes(key));
};

const isEthereumMainnet = (chainId: number) => {
  return chainId === mainnet.id;
};

const displayWalletWarning = (wallet: string) => {
  const lowerWallet = wallet.toLowerCase();
  const walletKey = Object.keys(FORBIDDEN_WALLETS).find(key => lowerWallet.includes(key));
  const displayName = walletKey ? FORBIDDEN_WALLETS[walletKey] : wallet;

  return toastError({
    message: `${displayName} does not support creating a contest.`,
    type: ErrorToastType.SIMPLE,
  });
};

export { displayWalletWarning, isEthereumMainnet, isWalletForbidden };
