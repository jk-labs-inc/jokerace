import { serverConfig } from "@config/wagmi/server";
import { getBytecode } from "@wagmi/core";

/**
 * Verifies that the deployed bytecode matches the expected bytecode.
 */
export const verifyContractBytecode = async (
  address: string,
  chainId: number,
  expectedDeployedBytecode: string,
): Promise<boolean> => {
  try {
    const onchainBytecode = await getBytecode(serverConfig, {
      address: address as `0x${string}`,
      chainId,
    });

    if (!onchainBytecode || !expectedDeployedBytecode) {
      return false;
    }

    return onchainBytecode === expectedDeployedBytecode;
  } catch (error) {
    console.error("Error verifying contract bytecode:", error);
    return false;
  }
};
