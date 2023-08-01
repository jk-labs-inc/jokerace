import button from "@components/UI/Button/styles";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const ctaGoBackStyles = button({
  class: "w-full 2xs:w-auto",
});

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
      <div className="container m-auto sm:text-center">
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
