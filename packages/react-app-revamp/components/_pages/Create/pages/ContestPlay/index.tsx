import ListContests from "@components/_pages/ListContests";
import { isSupabaseConfigured } from "@helpers/database";
import { useQuery } from "@tanstack/react-query";
import { getLiveContests, ITEMS_PER_PAGE } from "lib/contests";
import { useState } from "react";
import { useAccount } from "wagmi";

const ContestPlay = () => {
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  const { status, data, error, isFetching } = useQuery(["liveContests", page, address], () =>
    getLiveContests(page, 7, address),
  );

  return (
    <div className="text-[16px] mt-12 mb-14 w-2/3">
      {isSupabaseConfigured ? (
        <ListContests
          isFetching={isFetching}
          itemsPerPage={ITEMS_PER_PAGE}
          status={status}
          error={error}
          page={page}
          setPage={setPage}
          result={data}
          customTitle="Live Contests"
        />
      ) : (
        <div className="border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold">
          This site&apos;s current deployment does not have access to jokedao&apos;s reference database of contests, but
          you can check out our Supabase backups{" "}
          <a
            className="link px-1ex"
            href="https://github.com/JokeDAO/JokeDaoV2Dev/tree/staging/packages/supabase"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>{" "}
          for contest chain and address information!
        </div>
      )}
    </div>
  );
};

export default ContestPlay;
