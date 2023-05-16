import CreateFlow from "@components/_pages/Create";
import { DeployContestWrapper } from "@hooks/useDeployContest/store";
import type { NextPage } from "next";
import Head from "next/head";

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create a new contest - JokeDAO</title>
        <meta name="description" content="@TODO: change this" />
      </Head>

      <DeployContestWrapper>
        <CreateFlow />
      </DeployContestWrapper>
    </>
  );
};

export default Page;
