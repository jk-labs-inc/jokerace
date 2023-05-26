import CreateFlow from "@components/_pages/Create";
import { ContractFactoryWrapper } from "@hooks/useContractFactory";
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

      <ContractFactoryWrapper>
        <DeployContestWrapper>
          <CreateFlow />
        </DeployContestWrapper>
      </ContractFactoryWrapper>
    </>
  );
};

export default Page;
