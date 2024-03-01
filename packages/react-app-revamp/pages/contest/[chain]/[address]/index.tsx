import { chains, config } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { getLayout } from "@layouts/LayoutViewContest";
import { readContracts } from "@wagmi/core";
import type { NextPage } from "next";
import Head from "next/head";
import { parse } from "node-html-parser";
import { Abi } from "viem";

interface PageProps {
  address: string;
  title: string;
}

//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { title } = props;

  return (
    <>
      <Head>
        <title>{title} - jokerace</title>
      </Head>
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

// fn to get contest details for meta tags
async function getContestDetails(address: string, chainName: string) {
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
  const { abi } = await getContestContractVersion(address, chainId);

  const contracts = [
    {
      address: address as `0x${string}`,
      abi: abi as Abi,
      chainId,
      functionName: "name",
      args: [],
    },
    {
      address: address as `0x${string}`,
      abi: abi as Abi,
      chainId,
      functionName: "prompt",
      args: [],
    },
  ];

  const results = (await readContracts(config, { contracts })) as any;

  return results;
}

export async function getStaticProps({ params }: any) {
  const { chain, address } = params;
  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    chains.filter((c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain).length === 0
  ) {
    return { notFound: true };
  }

  let contestTitle = "";
  let contestDescription = "";

  try {
    const contestDetails = await getContestDetails(address, chain);
    const prompt = contestDetails[1].result as string;
    const contestDescriptionRaw = prompt.split("|")[2];

    contestTitle = contestDetails[0].result as string;
    contestDescription = parse(contestDescriptionRaw).textContent;
  } catch (error) {
    console.error("failed to retrieve title or description for metatags:", error);
  }

  return {
    props: {
      address,
      title: contestTitle,
      description: contestDescription,
    },
  };
}

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
