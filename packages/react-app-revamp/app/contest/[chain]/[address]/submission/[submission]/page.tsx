import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Submission from "./submission";
import { Abi } from "viem";

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

type Props = {
  params: {
    chain: string;
    address: string;
    submission: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { submission } = params;

  return {
    title: `Submission ${submission} - jokerace`,
    description: `Submission ${submission} for contest on jokerace`,
    openGraph: {
      title: `Submission ${submission} - jokerace`,
      description: `Submission ${submission} for contest on jokerace`,
    },
    twitter: {
      title: `Submission ${submission} - jokerace`,
      description: `Submission ${submission} for contest on jokerace`,
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
