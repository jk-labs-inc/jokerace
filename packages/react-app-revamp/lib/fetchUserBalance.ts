import { fetchBalance } from "@wagmi/core";

export async function fetchUserBalance(address: string, chainId: number, token?: string) {
  const balance = await fetchBalance({
    addressOrName: address,
    chainId,
    token,
  });

  return balance;
}
