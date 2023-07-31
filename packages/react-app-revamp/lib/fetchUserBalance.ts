import { fetchBalance } from "@wagmi/core";

export async function fetchUserBalance(address: string, chainId: number, token?: string) {
  const balance = await fetchBalance({
    address: address as `0x${string}`,
    chainId,
    token: token as `0x${string}`,
  });

  return balance;
}
