import { chains, config } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { getLayout } from "@layouts/LayoutViewContest";
import { readContracts } from "@wagmi/core";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
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

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params, req } = context;
  const address = Array.isArray(params?.address) ? params?.address[0] : params?.address;
  const chain = Array.isArray(params?.chain) ? params?.chain[0] : params?.chain;
  const cookie = req?.headers.cookie || "";

  if (
    !address ||
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    !chains.some(c => c.name.toLowerCase().replace(" ", "") === chain)
  ) {
    return { notFound: true };
  }

  let contestTitle = "";
  let contestDescription = "";

  try {
    const contestDetails = await getContestDetails(address, chain ?? "");
    const prompt = contestDetails[1].result as string;
    const contestDescriptionRaw = prompt.split("|")[2];

    contestTitle = contestDetails[0].result as string;
    contestDescription = parse(contestDescriptionRaw).textContent;
    return {
      props: {
        address,
        title: contestTitle,
        description: contestDescription,
        cookie,
      },
    };
  } catch (error) {
    console.error("Failed to retrieve title or description for meta tags:", error);
    return { notFound: true };
  }
};

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
