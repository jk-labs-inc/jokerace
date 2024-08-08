/* eslint-disable react/no-unescaped-entities */
import { ROUTE_VIEW_CONTESTS } from "@config/routes";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { SubmissionsResult, SubmissionWithContest } from "lib/user/types";
import Link from "next/link";
import { FC, useState, useEffect } from "react";
import { Pagination } from "react-headless-pagination";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import UserSubmissionList from "./components/List";

interface UserSubmissionsProps {
  submissions: SubmissionsResult | undefined;
  page: number;
  itemsPerPage: number;
  setPage: (page: number) => void;
  isError: boolean;
  isLoading: boolean;
}

const UserSubmission: FC<UserSubmissionsProps> = ({ submissions, page, itemsPerPage, setPage, isError, isLoading }) => {
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    if (submissions && submissions.count !== totalCount) {
      setTotalCount(submissions.count);
    }
  }, [submissions, totalCount]);

  const isInitialLoading = isLoading && totalCount === null;
  const isPaginationLoading = isLoading && totalCount !== null;

  if (isError) {
    return (
      <div className="container mx-auto flex flex-col gap-6 animate-appear mt-6">
        <h1 className="text-[40px] lg:text-[40px] font-sabo text-negative-10">ruh-roh!</h1>
        <p className="text-[16px] font-bold text-neutral-11">
          we were unable to fetch submissions for this user — please check url to make sure it's accurate <i>or</i>{" "}
          search for contests{" "}
          <Link href={ROUTE_VIEW_CONTESTS} className="text-primary-10">
            here
          </Link>
        </p>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className="container mx-auto mt-3">
        {new Array(itemsPerPage).fill(null).map((_, index) => (
          <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1} key={index}>
            <div
              className="flex items-center gap-6 border-t border-neutral-9 py-4 p-3 
              hover:bg-neutral-3 transition-colors duration-500 ease-in-out cursor-pointer text-[16px]"
            >
              <Skeleton circle width={32} height={32} />
              <Skeleton width={300} height={16} />
            </div>
          </SkeletonTheme>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-3">
      {totalCount !== null && totalCount > 0 && (
        <div className="px-4 py-3 text-[20px] font-bold">
          {totalCount} proposal{totalCount > 1 ? "s" : ""}
        </div>
      )}

      {totalCount !== null && (
        <>
          {totalCount === 0 ? (
            <div className="container mx-auto flex flex-col gap-2 animate-appear mt-6 p-0">
              <p className="text-[16px] font-bold text-neutral-11">user hasn't submitted in any contests... yet 👀</p>
              <p className="text-[12px] font-bold text-neutral-11">
                note: all proposals that are submitted before <b>September 13, 2023</b> aren't tracked in the user
                profile.
              </p>
            </div>
          ) : (
            <>
              {isPaginationLoading ? (
                <div>
                  {new Array(itemsPerPage).fill(null).map((_, index) => (
                    <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1} key={index}>
                      <div
                        className="flex items-center gap-6 border-t border-neutral-9 py-4 p-3 
                        hover:bg-neutral-3 transition-colors duration-500 ease-in-out cursor-pointer text-[16px]"
                      >
                        <Skeleton circle width={32} height={32} />
                        <Skeleton width={300} height={16} />
                      </div>
                    </SkeletonTheme>
                  ))}
                </div>
              ) : (
                submissions?.data.map((submission: SubmissionWithContest) => (
                  <UserSubmissionList
                    key={`user-submissions-${submission.proposal_id}`}
                    submission={submission}
                    isLoading={false}
                  />
                ))
              )}

              {Math.ceil(totalCount / itemsPerPage) > 1 && (
                <Pagination
                  currentPage={page}
                  setCurrentPage={(newPage: number) => setPage(newPage)}
                  totalPages={Math.ceil(totalCount / itemsPerPage)}
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserSubmission;
