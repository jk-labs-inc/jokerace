import Link from "next/link";
import { useRouter } from "next/router";
import shallow from "zustand/shallow";
import ProposalContent from "@components/_pages/ProposalContent";
import { ROUTE_CONTEST_PROPOSAL } from "@config/routes";
import truncate from "@helpers/truncate";
import { useStore } from "@hooks/useContest";

export const ListProposals = () => {
  const {
    query: { chain, address },
  } = useRouter();
  const { listProposalsData } = useStore(
    state => ({
      //@ts-ignore
      listProposalsData: state.listProposalsData,
    }),
    shallow,
  );
  if (Object.keys(listProposalsData).length === 0) {
    return <>No proposals</>;
  }

  return (
    <ul className="space-y-12">
      {Object.keys(listProposalsData).map(id => {
        return (
          <li className="relative" key={id}>
            <ProposalContent
              author={listProposalsData[id].author}
              isImage={listProposalsData[id].isContentImage}
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
          </li>
        );
      })}
    </ul>
  );
};

export default ListProposals;
