import { TransactionReceipt } from "viem";
import { getEthersProvider } from "./ethers";

export async function getTimestampFromReceipt(receipt: TransactionReceipt, chainId: number): Promise<number> {
  const provider = getEthersProvider({ chainId });

  const blockNumber = Number(receipt.blockNumber);
  const block = await provider.getBlock(blockNumber);

  return block.timestamp;
}
