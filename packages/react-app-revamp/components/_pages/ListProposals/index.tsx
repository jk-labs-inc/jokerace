import Link from "next/link";
import { useRouter } from "next/router";
import shallow from "zustand/shallow";
import ProposalContent from "@components/_pages/ProposalContent";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import truncate from "@helpers/truncate";
import { useStore } from "@hooks/useContest";
import { ChevronUpIcon } from "@heroicons/react/outline";
import styles from "./styles.module.css";
import { isAfter, isBefore } from "date-fns";

export const ListProposals = () => {
  const {
    query: { chain, address },
  } = useRouter();
  const { listProposalsData, votesOpen, votesClose } = useStore(
    state => ({
      //@ts-ignore
      listProposalsData: state.listProposalsData,
      //@ts-ignore
      votesOpen: state.votesOpen,
      //@ts-ignore
      votesClose: state.votesClose,
    }),
    shallow,
  );
  if (Object.keys(listProposalsData).length === 0) {
    return <>No proposals</>;
  }

  return (
    <ul className="space-y-12">
      {Object.keys(listProposalsData)
        .sort((a, b) => {
          // Sort proposals with most voted first
          if (listProposalsData[a].votes === listProposalsData[b].votes) {
            return listProposalsData[b].price - listProposalsData[a].price;
          }
          return listProposalsData[a].votes < listProposalsData[b].votes ? 1 : -1;
        })
        .map(id => {
          return (
            <li className={`"relative overflow-hidden text-sm ${styles.wrapper}`} key={id}>
              <div className="text-center border-is-[0.35rem] border-solid border-neutral-1 flex flex-col items-center pt-2">
                {isBefore(new Date(), votesOpen) ? (
                  <span className="text-3xs text-neutral-11 italic">Votes not open yet</span>
                ) : (
                  <button
                    disabled={isAfter(new Date(), votesClose)}
                    className="text-neutral-12 flex flex-col items-center justify-center font-bold text-2xs"
                  >
                    <ChevronUpIcon className="w-5 mb-1" />
                    {Intl.NumberFormat("en-US", {
                      notation: "compact",
                      maximumFractionDigits: 3,
                    }).format(parseFloat(listProposalsData[id].votes))}{" "}
                    <span className="text-neutral-11 text-3xs">vote{listProposalsData[id].votes > 1 && "s"}</span>
                  </button>
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
