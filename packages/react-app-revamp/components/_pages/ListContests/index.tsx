/* eslint-disable react-hooks/exhaustive-deps */
import Search from "@components/Search";
import Sort, { Sorting } from "@components/Sort";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";
import { useSortedData } from "@hooks/useSortedData";
import { FC, useState } from "react";
import { Pagination } from "react-headless-pagination";
import Contest from "./Contest";

interface ListContestsProps {
  status: "error" | "loading" | "success";
  page: number;
  setPage: any;
  isContestDataFetching: boolean;
  isRewardsFetching: boolean;
  itemsPerPage: number;
  contestData?: any;
  rewardsData?: any;
  error?: any;
  className?: string;
  allowToHide?: boolean;
  includeFullSearch?: boolean;
  includeSearch?: boolean;
  customTitle?: string;
  compact?: boolean;
  onFullSearchChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
}

export const ListContests: FC<ListContestsProps> = ({
  error,
  status,
  contestData,
  page,
  className,
  setPage,
  customTitle,
  includeSearch,
  rewardsData,
  isRewardsFetching,
  itemsPerPage,
  allowToHide,
  isContestDataFetching,
  compact = false,
  onSearchChange,
}) => {
  const [sorting, setSorting] = useState<Sorting | null>(null);
  const sortedData = useSortedData(contestData?.data, sorting);
  const [fadeBg, setFadeBg] = useState(false);
  const loading = status === "loading" || isContestDataFetching;
  const placeholderCount = compact ? 6 : 7;
  const placeholders = new Array(placeholderCount).fill(null);

  if (compact) {
    return (
      <>
        <div className="font-bold text-md grid-cols-1 grid gap-5 md:full-width-grid-cols items-center pie-1ex p-3">
          <h2 className="text-[20px] font-bold font-sabo">Featured Contests</h2>
          <Search onSearchChange={onSearchChange} />
          <Sort onSortChange={setSorting} onMenuStateChange={setFadeBg} />
        </div>
        {!isContestDataFetching && contestData?.count === 0 ? (
          <div className="text-neutral-9 text-center italic mb-6 animate-appear mt-12">No contests found</div>
        ) : (
          <div
            className={`grid ${
              fadeBg ? "opacity-50" : "opacity-100"
            } text-[16px] transition-opacity duration-300 ease-in-out`}
          >
            {loading
              ? placeholders.map((_, index) => (
                  <Contest
                    key={`placeholder-contest-${index}`}
                    contest={{}}
                    compact={compact}
                    loading={loading}
                    rewards={rewardsData}
                    rewardsLoading={isRewardsFetching}
                  />
                ))
              : sortedData
                  .slice(0, 6)
                  .map((contest: any, index: number) => (
                    <Contest
                      key={`contest-${index}`}
                      contest={contest}
                      compact={compact}
                      loading={loading}
                      rewards={rewardsData}
                      rewardsLoading={isRewardsFetching}
                    />
                  ))}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {status === "error" ? (
        <div className={`animate-appear bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4`}>
          <p className="text-sm font-bold text-negative-10 text-center">Something went wrong: {error?.message}</p>
        </div>
      ) : (
        <>
          {!isContestDataFetching && contestData?.count === 0 ? (
            <div className="text-neutral-9 text-center italic mb-6 animate-appear">No contests found</div>
          ) : (
            <div className={`${className}`}>
              <div
                className={`grid ${
                  fadeBg ? "opacity-50" : "opacity-100"
                } text-[16px] transition-opacity duration-300 ease-in-out`}
              >
                {loading ? (
                  placeholders.map((_, index) => (
                    <Contest
                      key={`placeholder-contest-${index}`}
                      contest={{}}
                      compact={compact}
                      loading={loading}
                      rewards={rewardsData}
                      rewardsLoading={isRewardsFetching}
                    />
                  ))
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 md:full-width-grid-cols lg:gap-0 items-center mb-4 font-bold text-[18px] pie-1ex p-3">
                      <div className="order-3 md:order-none">
                        {customTitle ? (
                          <span className="text-[20px] font-bold font-sabo">{customTitle}</span>
                        ) : (
                          <span aria-hidden="true">
                            🃏
                            <span className={`pis-1ex text-[20px]`}>{contestData?.count} contests</span>
                          </span>
                        )}
                      </div>
                      {includeSearch && (
                        <div className="order-1 md:order-none">
                          <Search onSearchChange={onSearchChange} />
                        </div>
                      )}

                      <div className="order-2 md:order-none">
                        <Sort onSortChange={setSorting} onMenuStateChange={setFadeBg} />
                      </div>
                    </div>
                    {sortedData.map((contest: any, index: number) => (
                      <Contest
                        key={`contest-${index}`}
                        contest={contest}
                        compact={compact}
                        allowToHide={allowToHide}
                        loading={loading}
                        rewards={rewardsData}
                        rewardsLoading={isRewardsFetching}
                      />
                    ))}
                  </>
                )}
              </div>

              {Math.ceil(contestData?.count / itemsPerPage) > 1 && (
                <Pagination
                  currentPage={page}
                  setCurrentPage={(newPage: number) => setPage(newPage)}
                  totalPages={Math.ceil(contestData.count / itemsPerPage)}
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
