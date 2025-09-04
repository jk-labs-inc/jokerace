import { setupDeploymentClients } from "@helpers/viem";
import { PublicClient, WalletClient } from "viem";

export interface DeploymentClients {
  client: WalletClient;
  publicClient: PublicClient;
}

export interface PrepareDeploymentParams {
  address: `0x${string}`;
  chainId: number;
}

export interface PrepareDeploymentError extends Error {
  userMessage?: string;
}

export const prepareForDeployment = async (params: PrepareDeploymentParams): Promise<DeploymentClients> => {
  const { address, chainId } = params;

  if (!address) {
    const error = new Error("No wallet address found") as PrepareDeploymentError;
    error.userMessage = "Failed to prepare for deployment";
    throw error;
  }

  let client: WalletClient;
  let publicClient: PublicClient;

  try {
    const { walletClient, publicClient: pubClient } = await setupDeploymentClients(address, chainId);

    if (!walletClient || !pubClient) {
      const error = new Error("Failed to setup deployment clients") as PrepareDeploymentError;
      error.userMessage = "Failed to setup deployment clients";
      throw error;
    }

    client = walletClient;
    publicClient = pubClient;
  } catch (error: any) {
    const prepError = error as PrepareDeploymentError;
    prepError.userMessage = "Please try reconnecting your wallet.";
    throw prepError;
  }

  return {
    client,
    publicClient,
  };
};
