import { TransactionReceipt } from "viem";
import { getEthersProvider } from "./ethers";

export async function getTimestampFromReceipt(receipt: TransactionReceipt, chainId: number): Promise<number> {
  const provider = getEthersProvider({ chainId });

  const blockNumber = Number(receipt.blockNumber);
  const block = await provider.getBlock(blockNumber);

  return block.timestamp;
}

export async function getTimestampFromReceiptWithRetries(
  receipt: TransactionReceipt,
  chainId: number,
  retries: number,
): Promise<number> {
  while (retries > 0) {
    try {
      return await getTimestampFromReceipt(receipt, chainId);
    } catch (error) {
      console.error("error retrieving timestamp, retrying:", error);
      retries--;
    }
  }

  throw new Error("failed to retrieve timestamp after multiple attempts");
}
