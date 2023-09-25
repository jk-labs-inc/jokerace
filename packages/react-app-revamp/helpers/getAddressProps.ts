import { fetchEnsAddress, fetchEnsName } from "@wagmi/core";

export const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getAddressProps(pathAddress: string) {
  let actualAddress = pathAddress;
  let ensName: string | null = null;

  if (pathAddress.endsWith(".eth")) {
    try {
      const resolvedAddress = await fetchEnsAddress({
        name: pathAddress,
        chainId: 1,
      });

      if (resolvedAddress) {
        actualAddress = resolvedAddress;
      } else {
        return { notFound: true };
      }
    } catch (error) {
      console.error("Error resolving ENS address:", error);
      return { notFound: true };
    }
  } else if (!REGEX_ETHEREUM_ADDRESS.test(pathAddress)) {
    return { notFound: true };
  }

  // If it's not an ENS name and is a valid Ethereum address, get the ENS name for it
  if (actualAddress === pathAddress) {
    try {
      const fetchedEnsName = await fetchEnsName({
        address: actualAddress as `0x${string}`,
        chainId: 1,
      });

      if (fetchedEnsName) {
        ensName = fetchedEnsName;
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    address: actualAddress,
    ensName: ensName || actualAddress,
  };
}
