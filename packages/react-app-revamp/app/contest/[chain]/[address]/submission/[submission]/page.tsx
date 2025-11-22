import { chains } from "@config/wagmi/server";
import getContestContractVersion from "@helpers/getContestContractVersion";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chain, address, submission } = params;

  const submissionUrl = `https://jokerace.io/contest/${chain}/${address}/submission/${submission}`;
  const frameImage = `https://jokerace.io/api/og/submission/${chain}/${address}/${submission}`;
  const contestUrl = `https://jokerace.io/contest/${chain}/${address}`;

  return {
    title: `Submission ${submission} - jokerace`,
    description: `Submission ${submission} for contest on jokerace`,
    openGraph: {
      title: `Submission ${submission} - jokerace`,
      description: `Submission ${submission} for contest on jokerace`,
      url: submissionUrl,
      images: [
        {
          url: frameImage,
          width: 1200,
          height: 630,
          alt: `Submission ${submission}`,
        },
      ],
    },
    twitter: {
      title: `Submission ${submission} - jokerace`,
      description: `Submission ${submission} for contest on jokerace`,
      card: "summary_large_image",
      images: [frameImage],
    },
    other: {
      // Farcaster Frame metadata
      "fc:frame": "vNext",
      "fc:frame:image": frameImage,
      "fc:frame:image:aspect_ratio": "1.91:1",
      "fc:frame:button:1": "Vote For",
      "fc:frame:button:1:action": "link",
      "fc:frame:button:1:target": submissionUrl,
      "fc:frame:button:2": "View Contest",
      "fc:frame:button:2:action": "link",
      "fc:frame:button:2:target": contestUrl,
      "fc:frame:button:3": "Visit Submission",
      "fc:frame:button:3:action": "link",
      "fc:frame:button:3:target": submissionUrl,
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
