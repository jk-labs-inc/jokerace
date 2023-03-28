import FormSearchContest from "@components/_pages/FormSearchContest";
import ListContests from "@components/_pages/ListContests";
import { isSupabaseConfigured } from "@helpers/database";
import { getLayout } from "@layouts/LayoutContests";
import { useQuery } from "@tanstack/react-query";
import { ITEMS_PER_PAGE, searchContests } from "lib/contests";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Page: NextPage = () => {
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState<string>("");
  const router = useRouter();

  const queryOptions = {
    keepPreviousData: true,
    staleTime: 5000,
  };

  const {
    status,
    data: queryData,
    error,
    isFetching,
  } = useQuery(
    ["searchedContests", title, page],
    () =>
      searchContests({
        searchString: title,
        pagination: {
          currentPage: page,
        },
      }),
    {
      ...queryOptions,
      enabled: title !== "",
    },
  );

  const adjustPaddingForInline = title.length > 0 ? "p-3" : "p-20";

  // If the user is on the /contests page, and they search for a contest, we want to update the URL to reflect that.
  useEffect(() => {
    if (!router.query.title) return;

    setTitle(router.query.title as string);
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Contests - JokeDAO</title>
        <meta name="description" content="@TODO: change this" />
      </Head>

      <div className={`container mx-auto ${adjustPaddingForInline}`}>
        {!title.length && (
          <h1 className="text-lg font-bold mb-4 flex flex-col text-center">
            <span aria-hidden="true" className="text-4xl -rotate-[10deg]">
              🃏
            </span>{" "}
            <span>Search contest</span>
          </h1>
        )}

        <FormSearchContest onSubmitTitle={setTitle} isInline={title.length ? true : false} />
      </div>

      {title.length > 0 && (
        <div className="container mx-auto pt-10">
          <h1 className="sr-only">Searched contests</h1>
          {isSupabaseConfigured ? (
            <ListContests
              isFetching={isFetching}
              itemsPerPage={ITEMS_PER_PAGE}
              status={status}
              error={error}
              page={page}
              setPage={setPage}
              result={queryData}
            />
          ) : (
            <div className="border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold">
              This site&apos;s current deployment does not have access to jokedao&apos;s reference database of contests,
              but you can check out our manual{" "}
              <a
                className="link px-1ex"
                href="https://docs.google.com/document/d/14NvQuYIv0CpSV8L5nR3iHwbnZ6yH--oywe2d_qDK3rE/edit"
                target="_blank"
                rel="noreferrer"
              >
                JokeDAO contests repository
              </a>{" "}
              for live contests!
            </div>
          )}
        </div>
      )}
    </>
  );
};

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
