import { chains } from "@config/wagmi";
import { getLayout } from "@layouts/LayoutViewContest";
import Head from "next/head";

import type { NextPage } from "next";
interface PageProps {
  address: string;
  contestName: string;
}

//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const { contestName } = props;

  return (
    <>
      <Head>
        <title>{contestName} - jokerace</title>
      </Head>
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: false };
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
    const contestName = "test passed data";

    return {
      props: {
        address,
        contestName,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
}
//@ts-ignore
Page.getLayout = getLayout;

export default Page;
