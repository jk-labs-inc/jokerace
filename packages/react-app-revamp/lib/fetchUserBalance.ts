import { config } from "@config/wagmi";
import { getTokenBalance } from "@helpers/getTokenBalance";
import { getBalance } from "@wagmi/core";

export async function fetchUserBalance(address: string, chainId: number, token?: string) {
  // For ERC20 tokens, use getTokenBalance
  if (token) {
    const balance = await getTokenBalance({
      tokenAddress: token as `0x${string}`,
      userAddress: address as `0x${string}`,
      chainId,
    });

    return balance;
  }

  // For native currency, use getBalance
  const balance = await getBalance(config, {
    address: address as `0x${string}`,
    chainId,
  });

  return {
    value: balance.value,
    decimals: balance.decimals,
  };
}
