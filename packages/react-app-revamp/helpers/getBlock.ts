import { getEthersProvider } from "./ethers";
import { Block } from "@ethersproject/abstract-provider";

export async function getBlockDetails(blockHash: string, chainId: number): Promise<Block | null> {
  try {
    const provider = getEthersProvider({ chainId });
    const blockInfo = await provider.getBlock(blockHash);
    return blockInfo;
  } catch (error) {
    console.error("Error fetching block details:", error);
    return null;
  }
}
