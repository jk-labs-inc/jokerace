import { getClient, getConnectorClient, type Config } from "@wagmi/core";
import { providers } from "ethers";
import type { Account, Chain, Client, Transport } from "viem";

const isProduction = process.env.NODE_ENV === "production";

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const headers = isProduction ? { Referer: "https://jokerace.io/" } : undefined;

  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) =>
          new providers.JsonRpcProvider(
            {
              skipFetchSetup: true,
              url: value?.url,
              headers,
            },
            network,
          ),
      ),
    );
  return new providers.JsonRpcProvider(
    {
      skipFetchSetup: true,
      url: transport.url,
      headers,
    },
    network,
  );
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
export function getEthersProvider(config: Config, { chainId }: { chainId?: number } = {}) {
  const client = getClient(config, { chainId });

  if (!client) {
    console.error({ config, chainId });
    throw new Error("Unable to get client");
  }

  return clientToProvider(client);
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Action to convert a Viem Client to an ethers.js Signer. */
export async function getEthersSigner(config: Config, { chainId }: { chainId?: number } = {}) {
  const client = await getConnectorClient(config, { chainId });
  return clientToSigner(client);
}
