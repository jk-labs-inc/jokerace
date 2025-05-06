import { getClient, getConnectorClient } from "@wagmi/core";
import { BrowserProvider, ethers, FallbackProvider, FetchRequest, JsonRpcProvider, JsonRpcSigner } from "ethers";
import type { Account, Chain, Client, Transport } from "viem";
import { type Config } from "wagmi";

const isProduction = process.env.NODE_ENV === "production";
const headers = isProduction
  ? { Referer: "https://jokerace.io/" }
  : { Referer: "https://jokerace-git-chore-fix-referer-implementation-jokerace.vercel.app/" };

const createJsonRpcProvider = (url: string, chainId: number, name: string, ensAddress?: string) => {
  const request = new FetchRequest(url);
  request.setHeader("Referer", headers.Referer);

  console.log(headers.Referer);

  const network = {
    chainId,
    name,
    ensAddress,
  };

  return new JsonRpcProvider(request, network);
};

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;

  if (transport.type === "fallback") {
    return new FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(({ value }) =>
        createJsonRpcProvider(value?.url, chain.id, chain.name, chain.contracts?.ensRegistry?.address),
      ),
    );
  }

  return createJsonRpcProvider(transport.url, chain.id, chain.name, chain.contracts?.ensRegistry?.address);
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
export function getEthersProvider(config: Config, { chainId }: { chainId?: number } = {}) {
  const client = getClient(config, { chainId });

  console.log("client", client);

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

  if (transport.type === "fallback") {
    return new FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(({ value }) =>
        createJsonRpcProvider(value?.url, chain.id, chain.name, chain.contracts?.ensRegistry?.address),
      ),
    );
  } else {
    const provider = new BrowserProvider(transport, network);
    return provider.getSigner(account.address);
  }
}

/** Action to convert a Viem Client to an ethers.js Signer. */
export async function getEthersSigner(config: Config, { chainId }: { chainId?: number } = {}) {
  const client = await getConnectorClient(config, { chainId });
  return clientToSigner(client);
}
