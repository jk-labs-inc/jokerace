import { chains } from "@config/wagmi/server";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { getFrameMetadata } from "frog/next";
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

const isDev = process.env.NODE_ENV === "development";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chain, address, submission } = params;

  const url = isDev ? "http://localhost:3000" : "https://jokerace.io";

  const frameMetadata = await getFrameMetadata(`${url}/api/contest/${chain}/${address}/submission/${submission}`);

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
    other: frameMetadata,
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
