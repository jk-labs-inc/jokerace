/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page not found - jokerace</title>
        <meta
          name="description"
          content="jokerace - contests for communities to make,
          execute, and reward decisions"
        />
      </Head>
      <div className="container m-auto sm:text-center animate-appear">
        <h1 className="text-[40px] font-black mb-3 text-primary-10 font-sabo">Page not found</h1>
        <p className="text-neutral-11 mb-6 text-[16px]">
          Sorry ! The page you are looking for was deleted or it doesn't exist.
        </p>
        <Link href="/">Go back to home page</Link>
      </div>
    </>
  );
};

export default Page;
