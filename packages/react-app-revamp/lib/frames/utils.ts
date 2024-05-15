import lensClient from "@config/lens";
import { chains, serverConfig } from "@config/wagmi/server";
import { getEnsName } from "@wagmi/core";

export const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export type SupportedChainId = 1 | 10 | 137 | 8453 | 42161 | 84532 | 7777777 | 666666666;
export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [1, 10, 8453, 84532, 7777777, 666666666];

export function isSupportedChainId(chainId: any): chainId is SupportedChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}

export const getChainId = (chain: string): number => {
  const chainId = chains.find(
    (c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain.toLowerCase(),
  )?.id;

  return chainId ?? 1;
};

export const fetchProfileName = async (ethereumAddress: string): Promise<string | null> => {
  let profileName: string | null = null;

  try {
    // attempt to fetch ENS name first
    profileName = await getEnsName(serverConfig, { address: ethereumAddress as `0x${string}`, chainId: 1 });

    // if ENS name is not available, try to fetch the Lens profile name
    if (!profileName) {
      const lensProfile = await lensClient.profile.fetchDefault({ for: ethereumAddress });
      const lensName = lensProfile?.handle?.localName;

      if (lensName) {
        profileName = `${lensName}.lens`;
      }
    }
  } catch (error) {
    profileName = null;
  }

  return profileName;
};
