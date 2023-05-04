import Head from "next/head";
import { Provider, createStore } from "@components/_pages/WizardFormCreateContest/store";
import WizardFormCreateContest from "@components/_pages/WizardFormCreateContest";
import type { NextPage } from "next";

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create a new contest - jokerace</title>
        <meta name="description" content="@TODO: change this" />
      </Head>

      <div className="container mx-auto pt-5">
        <h1 className="sr-only">Create a new contest</h1>
        <Provider createStore={createStore}>
          <WizardFormCreateContest />
        </Provider>
      </div>
    </>
  );
};

export default Page;
