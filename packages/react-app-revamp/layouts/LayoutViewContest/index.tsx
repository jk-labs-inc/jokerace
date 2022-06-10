import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useNetwork } from "wagmi";
import { format, isDate } from "date-fns";
import { Transition } from "@headlessui/react";
import { HomeIcon } from "@heroicons/react/solid";
import { CalendarIcon, ClipboardListIcon, DocumentDownloadIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import { ROUTE_VIEW_CONTEST_BASE_PATH } from "@config/routes";
import { chains } from "@config/wagmi";
import { useStore, useContestData, Provider, createStore } from "@hooks/useProviderContest";
import { getLayout as getBaseLayout } from "@layouts/LayoutBase";
import Button from "@components/Button";
import Loader from "@components/Loader";
import styles from "./styles.module.css";
import DialogModal from "@components/DialogModal";
import Timeline from "./Timeline";
import VotingToken from "./VotingToken";

const LayoutViewContest = (props: any) => {
  const { children } = props;
  const { activeChain, switchNetwork } = useNetwork();
  const { asPath } = useRouter();
  const url = asPath.split("/");
  const chainId = chains.filter(chain => chain.name.toLowerCase() === url[2])?.[0]?.id;
  const address = url[3];
  const { isLoading } = useContestData();
  const stateContest = useStore();
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);

  return (
    <div className="flex-grow container mx-auto relative md:grid md:gap-6  md:grid-cols-12">
      <div
        className={`${styles.navbar} ${styles.withFakeSeparator} justify-center md:justify-start md:pie-3  border-neutral-4 md:border-ie md:overflow-y-auto sticky inline-start-0 top-0 bg-true-black py-2 md:pt-0 md:mt-5 md:pb-10 md:h-full md:max-h-[calc(100vh-4rem)] md:col-span-4`}
      >
        <nav className={`${styles.navbar} md:space-y-1 `}>
          <Link
            href={{
              pathname: ROUTE_VIEW_CONTEST_BASE_PATH,
              //@ts-ignore
              query: { address, chainId },
            }}
          >
            <a className={`${styles.navLink}`}>
              <HomeIcon className={styles.navLinkIcon} /> Contest
            </a>
          </Link>
          <Link
            href={{
              pathname: ROUTE_VIEW_CONTEST_BASE_PATH,
              //@ts-ignore
              query: { address, chainId },
            }}
          >
            <a className={`${styles.navLink}`}>
              <ClipboardListIcon className={styles.navLinkIcon} />
              Rules
            </a>
          </Link>
        </nav>

        <button
          disabled={isLoading || activeChain?.id !== chainId}
          className={`md:mt-1 md:mb-3 ${
            isLoading || activeChain?.id !== chainId ? "opacity-50 cursor-not-allowed" : ""
          } ${styles.navLink}`}
        >
          <DocumentDownloadIcon className={styles.navLinkIcon} />
          Export data
        </button>
        <Button
          className="fixed md:static z-10 aspect-square 2xs:aspect-auto bottom-16 inline-end-5 md:bottom-unset md:inline-end-unset"
          disabled={isLoading || activeChain?.id !== chainId}
        >
          <PaperAirplaneIcon className="w-5 2xs:w-6 rotate-45 2xs:mie-0.5 -translate-y-0.5 md:hidden" />
          <span className="sr-only 2xs:not-sr-only">Submit</span>
        </Button>
        <Button
          onClick={() => setIsTimelineModalOpen(true)}
          disabled={
            isLoading ||
            activeChain?.id !== chainId ||
            !isDate(stateContest.submissionsOpen) ||
            !isDate(stateContest.votesOpen) ||
            !isDate(stateContest.votesClose)
          }
          intent="neutral-outline"
          className="min:bg-true-black min:bg-opacity-100 min:focus:bg-true-white min:hover:bg-true-black min:hover:bg-opacity-100 animate-appear fixed  md:static md:hidden z-10 aspect-square 2xs:aspect-auto bottom-32 2xs:bottom-[7.5rem] inline-end-5 md:bottom-unset md:inline-end-unset"
          disabled={isLoading || activeChain?.id !== chainId}
        >
          <CalendarIcon className="w-5 2xs:mie-1 md:hidden" />
          <span className="sr-only 2xs:not-sr-only">Timeline</span>
        </Button>
        {!isLoading &&
          activeChain?.id === chainId &&
          isDate(stateContest?.submissionsOpen) &&
          isDate(stateContest?.votesOpen) &&
          isDate(stateContest?.votesClose) && (
            <>
              <div className="hidden md:my-4 md:block">
                <VotingToken />
              </div>
              <div className="hidden md:block">
                <Timeline />
              </div>
            </>
          )}
      </div>
      <div className="md:pt-5 flex flex-col md:col-span-8">
        <Transition
          show={activeChain?.id !== chainId}
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex text-center flex-col mt-10 mx-auto">
            <p className="font-bold text-lg">Looks like you're using the wrong network.</p>
            <p className="mt-2 mb-4 text-neutral-11 text-xs">You need to use {url[2]} to check this contest.</p>
            <Button
              onClick={() => {
                switchNetwork?.(chainId);
              }}
              size="lg"
              className="mx-auto"
            >
              Switch network
            </Button>
          </div>
        </Transition>
        <Transition
          show={activeChain?.id === chainId && isLoading}
          as={Fragment}
          enter="ease-out duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 "
        >
          <div>
            <Loader />
          </div>
        </Transition>
        <Transition
          show={activeChain?.id === chainId && !isLoading}
          as={Fragment}
          enter="ease-out duration-300 delay-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 "
        >
          <div className="pt-3 md:pt-0">
            <h2 className="flex flex-wrap items-baseline text-neutral-11 font-bold mb-4">
              <span className="uppercase tracking-wide pie-1ex">{stateContest.contestName}</span>{" "}
              <span className="text-xs text-neutral-8">by {stateContest.contestAuthor}</span>
            </h2>
            {children}

            <DialogModal isOpen={isTimelineModalOpen} setIsOpen={setIsTimelineModalOpen} title="Contest timeline">
              {!isLoading &&
                activeChain?.id === chainId &&
                isDate(stateContest.submissionsOpen) &&
                isDate(stateContest.votesOpen) &&
                isDate(stateContest.votesClose) && (
                  <>
                    <h3 className="text-lg text-neutral-12 mb-3 font-black">{stateContest.contestName} - timeline</h3>
                    <div className="mb-2">
                      <VotingToken />
                    </div>
                    <Timeline />
                  </>
                )}
            </DialogModal>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export const getLayout = (page: any) => {
  const { address, chainId } = page.props;
  return getBaseLayout(
    <Provider createStore={() => createStore()}>
      <LayoutViewContest address={address} chainId={chainId}>
        {page}
      </LayoutViewContest>
    </Provider>,
  );
};
