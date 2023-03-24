import Loader from "@components/UI/Loader";
import { ROUTE_VIEW_CONTEST } from "@config/routes";
import { chainsImages } from "@config/wagmi";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";
import { format, getUnixTime } from "date-fns";
import Link from "next/link";
import { Pagination } from "react-headless-pagination";

interface ListContestsProps {
  status: "error" | "loading" | "success";
  result?: any;
  error?: any;
  page: number;
  setPage: any;
  isFetching: boolean;
  itemsPerPage: number;
}

export const ListContests = (props: ListContestsProps) => {
  const { error, status, result, page, setPage, itemsPerPage, isFetching } = props;
  return (
    <>
      {status === "loading" ? (
        <div className="animate-appear">
          <Loader />
        </div>
      ) : status === "error" ? (
        <div className="animate-appear bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
          <p className="text-sm font-bold text-negative-10 text-center">Something went wrong: {error?.message}</p>
        </div>
      ) : (
        <>
          {result?.count === 0 ? (
            <div className="text-neutral-9 text-center italic mb-6 animate-appear">No contests found</div>
          ) : (
            <div className="animate-appear">
              <div className="font-bold mb-4 text-md flex items-center pie-1ex">
                <span aria-hidden="true" className={`${isFetching ? "animate-card-rotation" : "opacity-90"}`}>
                  🃏
                </span>
                <span className={`pis-1ex ${isFetching && "animate-pulse"}`}>{result.count} contests</span>

                {isFetching && <span className="sr-only">Loading</span>}
              </div>
              <ul className="space-y-6">
                {/* @ts-ignore */}
                {result.data.map(contest => {
                  return (
                    <li
                      className="relative border border-solid border-neutral-4 bg-true-white bg-opacity-2.5 p-3 rounded-md hover:border-neutral-6 hover:bg-opacity-10 transition-all duration-200"
                      key={`live-contest-${contest.id}`}
                    >
                      <div className="flex items-center space-i-6">
                        {/* @ts-ignore */}
                        <img className="w-8 h-auto" src={chainsImages[contest.network_name]} alt="" />
                        <div className="flex flex-col">
                          <span className="font-bold text-md">{contest.title}</span>
                          <span className="roman">${contest.token_symbol}</span>
                          {getUnixTime(new Date()) < getUnixTime(new Date(contest.start_at)) && (
                            <time className="text-sm text-neutral-10 italic">
                              Starts {format(new Date(contest.start_at), "MMMM dd ppp")}
                            </time>
                          )}
                          {getUnixTime(new Date()) > getUnixTime(new Date(contest.end_at)) && (
                            <time className="text-sm text-neutral-10 italic">
                              Finished {format(new Date(contest.end_at), "MMMM dd ppp")}
                            </time>
                          )}
                          {getUnixTime(new Date()) > getUnixTime(new Date(contest.start_at)) &&
                            getUnixTime(new Date()) >= getUnixTime(new Date(contest.vote_start_at)) &&
                            getUnixTime(new Date()) <= getUnixTime(new Date(contest.end_at)) && (
                              <time className="text-sm text-neutral-11">
                                Voting open until {format(new Date(contest.end_at), "MMMM dd ppp")}
                              </time>
                            )}
                          {getUnixTime(new Date()) >= getUnixTime(new Date(contest.start_at)) &&
                            getUnixTime(new Date()) < getUnixTime(new Date(contest.vote_start_at)) &&
                            getUnixTime(new Date()) < getUnixTime(new Date(contest.end_at)) && (
                              <time className="text-sm text-neutral-11">
                                Submissions open until {format(new Date(contest.vote_start_at), "MMMM dd ppp")}
                              </time>
                            )}
                        </div>
                      </div>
                      <Link
                        href={{
                          pathname: ROUTE_VIEW_CONTEST,
                          query: {
                            chain: contest.network_name,
                            address: contest.address,
                          },
                        }}
                      >
                        <a className="absolute top-0 left-0 w-full h-full z-10 opacity-0">View contest</a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {Math.ceil(result.count / itemsPerPage) > 1 && (
                <Pagination
                  currentPage={page}
                  setCurrentPage={(newPage: number) => setPage(newPage)}
                  totalPages={Math.ceil(result.count / itemsPerPage)}
                  edgePageCount={1}
                  middlePagesSiblingCount={1}
                  className="mt-6 flex"
                  truncableText="..."
                  truncableClassName=""
                >
                  <Pagination.PrevButton className="disabled:opacity-50 disabled:pointer-events-none flex items-center space-i-4">
                    <ArrowLeftIcon className="w-5" />
                    <span className="sr-only sm:not-sr-only text-xs">Previous</span>
                  </Pagination.PrevButton>

                  <div className="flex items-center flex-wrap justify-center flex-grow">
                    <Pagination.PageButton
                      activeClassName="bg-primary-10 text-primary-1 hover:bg-opacity-90 focus:bg-primary-11"
                      inactiveClassName="bg-true-black text-neutral-10 hover:bg-true-white hover:bg-opacity-5 focus:bg-true-white focus:bg-opacity-10"
                      className="cursor-pointer flex items-center justify-center rounded-full font-bold w-12 h-12 text-xs border-solid border-4 border-true-black"
                    />
                  </div>

                  <Pagination.NextButton className="disabled:opacity-50 disabled:pointer-events-none flex items-center space-i-4">
                    <span className="sr-only sm:not-sr-only text-xs">Next</span>
                    <ArrowRightIcon className="w-5" />
                  </Pagination.NextButton>
                </Pagination>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ListContests;
