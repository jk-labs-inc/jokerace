import Loader from "@components/UI/Loader";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";
import { Pagination } from "react-headless-pagination";
import Contest from "./Contest";

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
      {status === "loading" || isFetching ? (
        <div className="animate-appear">
          <Loader />
        </div>
      ) : status === "error" ? (
        <div className="animate-appear bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
          <p className="text-sm font-bold text-negative-10 text-center">Something went wrong: {error?.message}</p>
        </div>
      ) : (
        <>
          {!isFetching && result?.count === 0 ? (
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
              <div className="grid grid-rows-7 text-[16px]">
                {result.data.map((contest: any) => {
                  return <Contest key={`live-contest-${contest.id}`} contest={contest} />;
                })}
              </div>
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

                  <div className="flex items-center flex-wrap justify-center flex-grow no-marker">
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
