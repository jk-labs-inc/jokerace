import { createFileRoute, notFound } from "@tanstack/react-router";
import { chains, config } from "@config/wagmi";
import { getChainId } from "@helpers/getChainId";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import { Abi } from "viem";
import SubmissionWrapper from "../../../../../../wrapper";

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const defaultMetadata = {
  title: "Contest Entry on JokeRace",
  description: "Contest Entry on JokeRace",
};

async function getContestName(address: string, chainName: string) {
  try {
    const chainId = chains.find(
      (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
    )?.id;

    const { abi } = await getContestContractVersion(address, chainId ?? 1);

    const result = await readContract(config, {
      address: address as `0x${string}`,
      abi: abi as Abi,
      chainId,
      functionName: "name",
    });

    return result as string;
  } catch (error) {
    console.error("failed to fetch contest name:", error);
    return "contest";
  }
}

export const Route = createFileRoute("/contest/$chain/$address/submission/$submission/")({
  loader: async ({ params }) => {
    const { chain, address, submission } = params;

    // Validate address format
    if (!REGEX_ETHEREUM_ADDRESS.test(address)) {
      throw notFound();
    }

    // Validate chain exists
    const isValidChain = chains.some(
      (c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain.toLowerCase(),
    );

    if (!isValidChain) {
      throw notFound();
    }

    // Fetch contract data
    const chainId = getChainId(chain);
    const { abi, version } = await getContestContractVersion(address, chainId);

    if (!abi || !version) {
      throw notFound();
    }

    // Fetch contest name for metadata
    const contestName = await getContestName(address, chain);

    return {
      address,
      chain,
      submission,
      chainId,
      abi: abi as Abi,
      version,
      contestName,
    };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: defaultMetadata.title }, { name: "description", content: defaultMetadata.description }],
      };
    }

    const title = `Entry for ${loaderData.contestName} contest on JokeRace`;
    const description = `Entry for ${loaderData.contestName} contest on JokeRace`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },

  component: SubmissionPage,
});

function SubmissionPage() {
  const { address, chain, submission, abi, version, chainId } = Route.useLoaderData();

  return (
    <SubmissionWrapper
      address={address}
      chain={chain}
      submission={submission}
      abi={abi}
      version={version}
      chainId={chainId}
    />
  );
}
