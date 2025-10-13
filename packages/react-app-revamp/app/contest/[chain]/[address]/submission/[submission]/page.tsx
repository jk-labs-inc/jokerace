import { chains, serverConfig } from "@config/wagmi/server";
import { getChainId } from "@helpers/getChainId";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Abi } from "viem";
import SubmissionWrapper from "./wrapper";

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const defaultMetadata = {
  title: "Contest Entry on JokeRace",
  description: "Contest Entry on JokeRace",
  openGraph: {
    title: "Contest Entry on JokeRace",
    description: "Contest Entry on JokeRace",
  },
  twitter: {
    title: "Contest Entry on JokeRace",
    description: "Contest Entry on JokeRace",
  },
};

async function getContestName(address: string, chainName: string) {
  try {
    const chainId = chains.find(
      (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
    )?.id;

    const { abi } = await getContestContractVersion(address, chainId ?? 1);

    const result = await readContract(serverConfig, {
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

export async function generateMetadata(props: {
  params: Promise<{ chain: string; address: string; submission: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { chain, address } = params;

  if (!address || address === "undefined" || !chain) {
    console.error("invalid params received:", { chain, address });
    return defaultMetadata;
  }

  try {
    const contestName = await getContestName(address, chain);
    const title = `Entry for ${contestName} contest on JokeRace`;
    const description = `Entry for ${contestName} contest on JokeRace`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
      },
      twitter: {
        title,
        description,
      },
    };
  } catch (error) {
    console.error("failed to generate metadata:", error);
    return defaultMetadata;
  }
}

const Page = async (props: { params: Promise<{ chain: string; address: string; submission: string }> }) => {
  const params = await props.params;
  const { chain, address, submission } = params;
  const chainId = getChainId(chain);
  const { abi, version } = await getContestContractVersion(address, chainId);

  try {
    if (!REGEX_ETHEREUM_ADDRESS.test(address) || !chain || !abi || !version) {
      return notFound();
    }

    return (
      <SubmissionWrapper
        address={address}
        chain={chain}
        submission={submission}
        abi={abi as Abi}
        version={version}
        chainId={chainId}
      />
    );
  } catch (error) {
    console.error("failed to render submission page:", error);
    return notFound();
  }
};

export default Page;
