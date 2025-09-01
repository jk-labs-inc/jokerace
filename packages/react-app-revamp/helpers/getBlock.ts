import { Block, createPublicClient, http } from "viem";
import { getChainFromId } from "./getChainFromId";

export async function getBlockDetails(blockHash: string, chainId: number): Promise<Block | null> {
  try {
    const chain = getChainFromId(chainId);
    const client = createPublicClient({
      chain: chain,
      transport: http(chain?.rpcUrls.default.http[0] ?? ""),
    });

    const blockInfo = await client.getBlock({
      blockHash: blockHash as `0x${string}`,
    });

    return blockInfo;
  } catch (error) {
    console.error("Error fetching block details:", error);
    return null;
  }
}
