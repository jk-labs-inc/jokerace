import { chains, serverConfig } from "@config/wagmi/server";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { readContract } from "@wagmi/core";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Abi } from "viem";
import Submission from "./submission";

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

type Props = {
  params: {
    chain: string;
    address: string;
    submission: string;
  };
};

async function getContestDetails(address: string, chainName: string) {
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

  return result;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chain, address } = params;
  const contestName = await getContestDetails(address, chain);

  const title = `Submission for ${contestName} contest on JokeRace`;
  const description = `Submission for ${contestName} contest on JokeRace`;

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
}

const Page = async ({ params }: Props) => {
  const { chain, address, submission } = params;
  const chainId = chains.find((c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain)?.id;
  const { abi, version } = await getContestContractVersion(address, chainId ?? 1);

  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    !chains.some((c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain) ||
    !submission
  ) {
    return notFound();
  }

  return <Submission address={address} chain={chain} submission={submission} abi={abi as Abi} version={version} />;
};

export default Page;
