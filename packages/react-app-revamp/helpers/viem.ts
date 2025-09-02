import { createWalletClient, custom } from "viem";
import { getChainFromId } from "./getChainFromId";
import { getPublicClient } from "@wagmi/core";
import { config } from "@config/wagmi";

export async function setupDeploymentClients(userAddress: `0x${string}`, chainId: number) {
  const chain = getChainFromId(chainId);

  const walletClient = createWalletClient({
    account: userAddress,
    chain,
    transport: custom(window.ethereum),
  });

  const publicClient = getPublicClient(config, { chainId: chain?.id });

  return { walletClient, publicClient, chain };
}
