import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { getLayout } from "@layouts/LayoutViewContest";
import { readContracts } from "@wagmi/core";
import type { NextPage } from "next";
import Head from "next/head";
import { parse } from "node-html-parser";

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
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const { abi } = await getContestContractVersion(address, chainId);

  const contracts = [
    {
      address,
      abi,
      chainId,
      functionName: "name",
      args: [],
    },
    {
      address,
      abi,
      chainId,
      functionName: "prompt",
      args: [],
    },
  ];

  //@ts-ignore
  const results = (await readContracts({ contracts })) as any;

  return results;
}

export async function getStaticProps({ params }: any) {
  const { chain, address } = params;
  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    chains.filter(c => c.name.toLowerCase().replace(" ", "") === chain).length === 0
  ) {
    return { notFound: true };
  }

  try {
    const contestDetails = await getContestDetails(address, chain);
    const contestTitle = contestDetails[0].result as string;
    const prompt = contestDetails[1].result as string;
    const contestDescriptionRaw = prompt.split("|")[2];
    const contestDescription = parse(contestDescriptionRaw).textContent;

    return {
      props: {
        address,
        title: contestTitle,
        description: contestDescription,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
//@ts-ignore
Page.getLayout = getLayout;

export default Page;
