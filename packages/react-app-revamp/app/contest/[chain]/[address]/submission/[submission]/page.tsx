import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Submission from "./submission";

type Props = {
  params: {
    chain: string;
    address: string;
    submission: string;
  };
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const getChainId = (chain: string) => {
  const chainId = chains.find((c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain)?.id;

  if (chainId === undefined) {
    throw new Error(`Chain ID not found for chain: ${chain}`);
  }
  return chainId;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { submission } = params;

  return {
    title: `Submission ${submission} - jokerace`,
  };
}

const Page = async ({ params }: Props) => {
  const { chain, address, submission } = params;
  const chainId = getChainId(chain);
  const { abi, version } = await getContestContractVersion(address, chainId);

  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    !chains.some((c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain) ||
    !submission
  ) {
    return notFound();
  }

  return (
    <Submission abi={abi} address={address} chain={chain} chainId={chainId} submission={submission} version={version} />
  );
};

export default Page;
