import { createWalletClient, custom } from "viem";
import { getChainFromId } from "./getChainFromId";
import { getPublicClient } from "@wagmi/core";
import { config } from "@config/wagmi";

export async function setupDeploymentClients(chainId: number) {
  const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
  const chain = getChainFromId(chainId);

  const walletClient = createWalletClient({
    account: account as `0x${string}`,
    chain,
    transport: custom(window.ethereum),
  });

  const publicClient = getPublicClient(config, { chainId: chain?.id });

  return { walletClient, publicClient, account: account as `0x${string}`, chain };
}
