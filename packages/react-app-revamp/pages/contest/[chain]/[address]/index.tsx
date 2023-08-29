import { chains } from "@config/wagmi";
import { useContestStore } from "@hooks/useContest/store";
import { getLayout } from "@layouts/LayoutViewContest";
import type { NextPage } from "next";
import Head from "next/head";

interface PageProps {
  address: string;
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { contestName, contestPrompt } = useContestStore(state => state);
  const [, title] = contestPrompt.split("|");

  return (
    <>
      <Head>
        <title>{contestName.toLowerCase()} - jokerace</title>
        <meta property="og:title" content={`${contestName.toLowerCase()} - jokerace`} key="title" />
        <meta property="og:description" content={`${title.toLowerCase()}`} key="description" />
      </Head>
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
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
    return {
      props: {
        address,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
//@ts-ignore
Page.getLayout = getLayout;

export default Page;
