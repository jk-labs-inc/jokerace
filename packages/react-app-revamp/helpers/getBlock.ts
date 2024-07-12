import { config } from "@config/wagmi";
import { Block } from "@ethersproject/abstract-provider";
import { getEthersProvider } from "./ethers";

export async function getBlockDetails(blockHash: string, chainId: number): Promise<Block | null> {
  try {
    const provider = getEthersProvider(config, { chainId });
    const blockInfo = await provider.getBlock(blockHash);
    return blockInfo;
  } catch (error) {
    console.error("Error fetching block details:", error);
    return null;
  }
}
