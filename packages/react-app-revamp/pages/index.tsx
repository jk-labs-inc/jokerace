import Explainer from "@components/Explainer";
import Subscribe from "@components/Subscribe";
import BurgerMenu from "@components/UI/BurgerMenu";
import Button from "@components/UI/Button";
import { ConnectButtonCustom } from "@components/UI/ConnectButton";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import EthereumAddress from "@components/UI/UserProfileDisplay";
import ListContests from "@components/_pages/ListContests";
import { FOOTER_LINKS } from "@config/links";
import { ROUTE_VIEW_LIVE_CONTESTS, ROUTE_VIEW_USER } from "@config/routes";
import { isSupabaseConfigured } from "@helpers/database";
import useContestSortOptions from "@hooks/useSortOptions";
import { useQuery } from "@tanstack/react-query";
import { ITEMS_PER_PAGE, getFeaturedContests, getLiveContests, getRewards, searchContests } from "lib/contests";
import type { NextPage } from "next";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

function useContests(searchValue: string, sortBy?: string) {
  const [page, setPage] = useState(0);
  const { address } = useAccount();

  const {
    status,
    data: contestData,
    error,
    isFetching: isContestDataFetching,
  } = useQuery(
    [searchValue || sortBy ? "searchedContests" : "featuredContests", page, address, searchValue, sortBy],
    () => {
      if (searchValue) {
        // Call searchContests if there is a searchValue
        return searchContests(
          {
            searchString: searchValue,
            pagination: {
              currentPage: page,
            },
          },
          address,
          sortBy,
        );
      } else if (sortBy) {
        return getLiveContests(page, 6, address, sortBy);
      } else {
        // Call getFeaturedContests otherwise
        return getFeaturedContests(page, 6, address);
      }
    },
  );

  const {
    status: rewardsStatus,
    data: rewardsData,
    error: rewardsError,
    isFetching: isRewardsFetching,
  } = useQuery(["rewards", contestData], data => getRewards(contestData?.data ?? []), {
    enabled: !!contestData,
  });

  return {
    page,
    setPage,
    status,
    contestData,
    rewardsData,
    isRewardsFetching,
    error,
    isContestDataFetching,
  };
}

const Page: NextPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const { address } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const allowedLinks = ["Github", "Mirror", "Twitter", "Telegram", "Report a bug", "Terms"];
  const filteredLinks = FOOTER_LINKS.filter(link => allowedLinks.includes(link.label));
  const [sortBy, setSortBy] = useState<string>("");
  const sortOptions = useContestSortOptions("liveContests");
  const { page, setPage, status, contestData, rewardsData, isRewardsFetching, error, isContestDataFetching } =
    useContests(searchValue, sortBy);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onViewAll = () => {
    if (searchValue) {
      router.push(`/contests?title=${searchValue}&sortBy=${sortBy}`);
    } else if (sortBy) {
      router.push(`${ROUTE_VIEW_LIVE_CONTESTS}?sortBy=${sortBy}`);
    } else {
      router.push(ROUTE_VIEW_LIVE_CONTESTS);
    }
  };

  return (
    <>
      <div className="pl-8 pr-8 md:pl-16 md:pr-16 mt-4 md:mt-14 lg:mt-6 max-w-[1350px] 3xl:pl-28 2xl:pr-0 ">
        <div className="hidden lg:flex mb-8">
          <p className="text-[18px] md:text-[20px] font-bold">
            contests for communities to make, <br />
            execute, and reward decisions
          </p>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {isClient && address ? (
            <>
              <Link href={`${ROUTE_VIEW_USER.replace("[address]", address)}`}>
                <UserProfileDisplay ethereumAddress={address} shortenOnFallback avatarVersion />
              </Link>
              <ConnectButtonCustom displayOptions={{ onlyChainSwitcher: true, showChainName: false }} />
            </>
          ) : null}

          <div>
            <BurgerMenu>
              <div className="flex flex-col gap-2">
                {filteredLinks.map((link, key) => (
                  <a
                    className="font-sabo text-neutral-11 text-[24px] py-2 xs:px-2"
                    key={`footer-link-${key}`}
                    href={link.href}
                    rel="nofollow noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </BurgerMenu>
          </div>
        </div>

        <div className="hidden lg:full-width-grid-cols lg:gap-0">
          <div>
            <div className="text-[16px] font-bold  mb-1">stage one</div>
            <div className="h-1 bg-secondary-11"></div>
            <div className="text-[16px] font-bold mt-1 text-secondary-11">creator asks a prompt</div>
          </div>
          <div>
            <div className="text-[16px] font-bold   mb-1">stage two</div>
            <div className="h-1 bg-primary-10"></div>
            <div className="text-[16px]  font-bold mt-1 text-primary-10">submitters respond</div>
          </div>
          <div>
            <div className="text-[16px] font-bold  mb-1">stage three</div>
            <div className="h-1 bg-positive-11"></div>
            <div className="text-[16px] font-bold mt-1 text-positive-11">voters pick top submissions</div>
          </div>
        </div>

        <div className="text-[16px] mt-14 -ml-[15px]">
          {isSupabaseConfigured ? (
            <div className="flex flex-col">
              <ListContests
                isContestDataFetching={isContestDataFetching}
                isRewardsFetching={isRewardsFetching}
                itemsPerPage={ITEMS_PER_PAGE}
                status={status}
                error={error}
                page={page}
                setPage={setPage}
                contestData={contestData}
                rewardsData={rewardsData}
                compact={true}
                onSearchChange={setSearchValue}
                onSortChange={setSortBy}
                sortOptions={sortOptions}
              />
              <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between mt-5">
                <Subscribe />
                <Button className="bg-primary-10 text-[18px] w-[146px] font-bold" onClick={onViewAll}>
                  View all
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-neutral-4 animate-appear p-3 rounded-md border-solid border mb-5 text-sm font-bold">
              This site&apos;s current deployment does not have access to jokerace&apos;s reference database of
              contests, but you can check out our Supabase backups{" "}
              <a
                className="link px-1ex"
                href="https://github.com/jk-labs-inc/jokerace/tree/staging/packages/supabase"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>{" "}
              for contest chain and address information!
            </div>
          )}
        </div>
      </div>
      <Explainer />
    </>
  );
};

export default Page;
