import Link from "next/link";
import { useRouter } from "next/router";
import shallow from "zustand/shallow";
import { isAfter, isBefore } from "date-fns";
import Button from "@components/Button";
import ProposalContent from "@components/_pages/ProposalContent";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import truncate from "@helpers/truncate";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import { useStore as useStoreSubmitProposal } from "@hooks/useSubmitProposal/store";
import { useStore as useStoreCastVotes } from "@hooks/useCastVotes/store";
import styles from "./styles.module.css";
import { IconCaretUp } from "@components/Icons";

export const ListProposals = () => {
  const {
    query: { chain, address },
  } = useRouter();
  const {
    submissionsOpen,
    listProposalsData,
    currentUserAvailableVotesAmount,
    votesOpen,
    votesClose,
  } = useStoreContest(
    state => ({
      //@ts-ignore
      listProposalsData: state.listProposalsData,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
      //@ts-ignore
      currentUserAvailableVotesAmount: state.currentUserAvailableVotesAmount,
      //@ts-ignore
      submissionsOpen: state.submissionsOpen,
    }),
    shallow,
  );
  const stateSubmitProposal = useStoreSubmitProposal();
  const { setPickedProposal, setIsModalOpen } = useStoreCastVotes(
    state => ({
      //@ts-ignore
      setPickedProposal: state.setPickedProposal,
      //@ts-ignore
      setIsModalOpen: state.setIsModalOpen,
    }),
    shallow,
  );

  function onClickProposalVote(proposalId: number | string) {
    setPickedProposal(proposalId);
    setIsModalOpen(true);
  }

  if (isBefore(new Date(), submissionsOpen))
    return <p className="text-neutral-9 italic mb-6">Submissions aren&apos;t open yet.</p>;

  if (Object.keys(listProposalsData).length === 0) {
    return (
      <div className="flex flex-col text-center items-center">
        <p className="text-neutral-9 italic mb-6">It seems no one submitted a proposal for this contest yet.</p>
        {/* @ts-ignore */}
        <Button onClick={() => stateSubmitProposal.setIsModalOpen(true)}>Submit a proposal</Button>
      </div>
    );
  }

  return (
    <ul className={`${styles.list} space-y-12`}>
      {Object.keys(listProposalsData)
        .sort((a, b) => {
          if (listProposalsData[a].votes === listProposalsData[b].votes) {
            return listProposalsData[b].price - listProposalsData[a].price;
          }
          return listProposalsData[a].votes < listProposalsData[b].votes ? 1 : -1;
        })
        .map((id, i) => {
          return (
            <li
              className={`${styles.listElement} px-5 pt-5 pb-3 rounded-md 2xs:p-0 border border-solid border-neutral-1 2xs:border-0 relative overflow-hidden text-sm ${styles.wrapper}`}
              key={id}
            >
              <div className="text-center 2xs:border-none border-solid border-neutral-1 flex flex-col 2xs:items-center pt-2">
                {isBefore(new Date(), votesOpen) ? (
                  <span className="text-3xs text-neutral-11 italic">Votes not open yet</span>
                ) : (
                  <>
                    {listProposalsData[id].votes > 0 && (
                      <span
                        className={`${styles.rankIndicator} rounded-full items-center flex justify-center aspect-square text-opacity-100 mb-3`}
                      >
                        #{i + 1}
                      </span>
                    )}

                    <button
                      onClick={() => onClickProposalVote(id)}
                      disabled={isAfter(new Date(), votesClose) || currentUserAvailableVotesAmount === 0}
                      className="disabled:border-none border p-2 border-solid border-neutral-6 rounded-md disabled:text-opacity-50 disabled:cursor-not-allowed text-neutral-12 flex 2xs:flex-col items-center 2xs:justify-center font-bold text-2xs"
                    >
                      {isBefore(new Date(), votesClose) && currentUserAvailableVotesAmount > 0 && (
                        <IconCaretUp className="text-xs mie-2 2xs:mie-0 2xs:mb-1" />
                      )}
                      {Intl.NumberFormat("en-US", {
                        notation: "compact",
                        maximumFractionDigits: 3,
                      }).format(parseFloat(listProposalsData[id].votes))}{" "}
                      <span className="text-neutral-11 pis-1ex 2xs:pis-0 text-3xs">
                        vote{listProposalsData[id].votes > 1 && "s"}
                      </span>
                    </button>
                  </>
                )}
              </div>
              <div className="relative overflow-hidden">
                <ProposalContent
                  author={listProposalsData[id].author}
                  content={
                    listProposalsData[id].isContentImage
                      ? listProposalsData[id].content
                      : truncate(listProposalsData[id].content, 280)
                  }
                />
                <Link
                  href={{
                    pathname: ROUTE_CONTEST_PROPOSAL,
                    //@ts-ignore
                    query: {
                      chain,
                      address,
                      proposal: id,
                    },
                  }}
                >
                  <a title={`View proposal #${id}`} className="absolute opacity-0 inset-0 w-full h-full z-10 ">
                    View proposal #{id}
                  </a>
                </Link>
              </div>
            </li>
          );
        })}
    </ul>
  );
};

export default ListProposals;
