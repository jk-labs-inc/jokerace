import shallow from "zustand/shallow";
import { useRouter } from "next/router";
import Link from "next/link";
import { useNetwork } from "wagmi";
import { isAfter, isBefore, isDate } from "date-fns";
import { HomeIcon } from "@heroicons/react/solid";
import { CalendarIcon, ClipboardListIcon, DocumentDownloadIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import {
  ROUTE_CONTEST_PROPOSAL,
  ROUTE_VIEW_CONTEST,
  ROUTE_VIEW_CONTEST_EXPORT_DATA,
  ROUTE_VIEW_CONTEST_RULES,
} from "@config/routes";
import Button from "@components/Button";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { useStore as useStoreSubmitProposal } from "@hooks/useSubmitProposal/store";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import Timeline from "../Timeline";
import VotingToken from "../VotingToken";
import styles from "./styles.module.css";

export const Sidebar = (props: any) => {
  const { query, pathname } = useRouter();
  const { activeChain } = useNetwork();
  const {
    isLoading,
    isListProposalsLoading,
    isSuccess,
    isError,
    isListProposalsError,
    chainId,
    setIsTimelineModalOpen,
  } = props;

  const {
    amountOfTokensRequiredToSubmitEntry,
    currentUserAvailableVotesAmount,
    listProposalsIds,
    currentUserProposalCount,
    contestMaxNumberSubmissionsPerUser,
    contestMaxProposalCount,
    submissionsOpen,
    votesOpen,
    votesClose,
    contestStatus,
  } = useStoreContest(
    state => ({
      //@ts-ignore
      contestStatus: state.contestStatus,
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
      //@ts-ignore
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
      //@ts-ignore
      contestMaxNumberSubmissionsPerUser: state.contestMaxNumberSubmissionsPerUser,
      //@ts-ignore
      contestMaxProposalCount: state.contestMaxProposalCount,
      //@ts-ignore
      currentUserProposalCount: state.currentUserProposalCount,
      //@ts-ignore
      listProposalsIds: state.listProposalsIds,
      //@ts-ignore
      amountOfTokensRequiredToSubmitEntry: state.amountOfTokensRequiredToSubmitEntry,
    }),
    shallow,
  );

  const stateSubmitProposal = useStoreSubmitProposal();

  return (
    <>
      <nav className={`${styles.navbar} md:space-y-1 `}>
        <Link
          href={{
            pathname: ROUTE_VIEW_CONTEST,
            //@ts-ignore
            query: {
              chain: query.chain,
              address: query.address,
            },
          }}
        >
          <a
            className={`${styles.navLink} ${
              [ROUTE_VIEW_CONTEST, ROUTE_CONTEST_PROPOSAL].includes(pathname) ? styles["navLink--active"] : ""
            }`}
          >
            <HomeIcon className={styles.navLinkIcon} /> Contest
          </a>
        </Link>
        <Link
          href={{
            pathname: ROUTE_VIEW_CONTEST_RULES,
            //@ts-ignore
            query: {
              chain: query.chain,
              address: query.address,
            },
          }}
        >
          <a className={`${styles.navLink} ${pathname === ROUTE_VIEW_CONTEST_RULES ? styles["navLink--active"] : ""}`}>
            <ClipboardListIcon className={styles.navLinkIcon} />
            Rules
          </a>
        </Link>
        <Link
          href={{
            pathname: ROUTE_VIEW_CONTEST_EXPORT_DATA,
            //@ts-ignore
            query: {
              chain: query.chain,
              address: query.address,
            },
          }}
        >
          <a
            className={`${styles.navLink} ${
              pathname === ROUTE_VIEW_CONTEST_EXPORT_DATA ? styles["navLink--active"] : ""
            }`}
          >
            <DocumentDownloadIcon className={styles.navLinkIcon} />
            Export data
          </a>
        </Link>
      </nav>

      {!isLoading && contestStatus === CONTEST_STATUS.SUBMISSIONS_OPEN && (
        <>
          <Button
            /* @ts-ignore */
            onClick={() => stateSubmitProposal.setIsModalOpen(true)}
            className="animate-appear fixed md:static z-10  md:mt-3 aspect-square 2xs:aspect-auto bottom-16 inline-end-5 md:bottom-unset md:inline-end-unset"
            intent={
              currentUserAvailableVotesAmount < amountOfTokensRequiredToSubmitEntry ||
              currentUserProposalCount === contestMaxNumberSubmissionsPerUser ||
              contestMaxProposalCount === listProposalsIds.length
                ? "primary-outline"
                : "primary"
            }
            disabled={
              isLoading ||
              isListProposalsLoading ||
              isListProposalsError !== null ||
              isError !== null ||
              activeChain?.id !== chainId ||
              currentUserAvailableVotesAmount < amountOfTokensRequiredToSubmitEntry ||
              currentUserProposalCount === contestMaxNumberSubmissionsPerUser ||
              contestMaxProposalCount === listProposalsIds.length
            }
          >
            <PaperAirplaneIcon className="w-5 2xs:w-6 rotate-45 2xs:mie-0.5 -translate-y-0.5 md:hidden" />
            <span className="sr-only 2xs:not-sr-only">Submit</span>
          </Button>
        </>
      )}
      <Button
        onClick={() => setIsTimelineModalOpen(true)}
        disabled={
          isLoading ||
          isError !== null ||
          activeChain?.id !== chainId ||
          !isDate(submissionsOpen) ||
          !isDate(votesOpen) ||
          !isDate(votesClose)
        }
        intent="true-solid-outline"
        className={`
  ${
    !isDate(submissionsOpen) ||
    !isDate(votesOpen) ||
    !isAfter(new Date(), submissionsOpen) ||
    !isBefore(new Date(), votesOpen)
      ? "bottom-16"
      : "bottom-32"
  }
  animate-appear fixed md:static md:hidden z-10 aspect-square 2xs:aspect-auto 2xs:bottom-[7.5rem] inline-end-5 md:bottom-unset md:inline-end-unset`}
      >
        <CalendarIcon className="w-5 2xs:mie-1 md:hidden" />
        <span className="sr-only 2xs:not-sr-only">Timeline</span>
      </Button>
      {!isLoading &&
        isSuccess &&
        activeChain?.id === chainId &&
        isDate(submissionsOpen) &&
        isDate(votesOpen) &&
        isDate(votesClose) && (
          <>
            <div className="hidden md:my-4 md:block">
              <VotingToken />
            </div>
            <div className="hidden md:block">
              <Timeline />
            </div>
          </>
        )}
    </>
  );
};

export default Sidebar;
