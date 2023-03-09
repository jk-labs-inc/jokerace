import Button from "@components/UI/Button";
import ListProposalVotes from "@components/_pages/ListProposalVotes";
import ProposalContent from "@components/_pages/ProposalContent";
import { chains } from "@config/wagmi";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import isProposalDeleted from "@helpers/isProposalDeleted";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { ProposalVotesWrapper } from "@hooks/useProposalVotes/store";
import { useUserStore } from "@hooks/useUser/store";
import { getLayout } from "@layouts/LayoutViewContest";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

interface PageProps {
  address: string;
  proposal: string;
}
//@ts-ignore
const Page: NextPage = (props: PageProps) => {
  const {
    query: { proposal, address },
  } = useRouter();
  const { checkIfUserPassedSnapshotLoading, didUserPassSnapshotAndCanVote, currentUserAvailableVotesAmount } =
    useUserStore(state => state);
  const { listProposalsData } = useProposalStore(state => state);
  const { contestName, contestStatus } = useContestStore(state => state);

  const { setPickedProposal, setIsModalOpen } = useCastVotesStore(state => state);

  function onClickProposalVote() {
    const proposalId = Array.isArray(proposal) ? proposal[0] : proposal;
    if (!proposalId) return;
    setPickedProposal(proposalId);
    setIsModalOpen(true);
  }

  return (
    <>
      <Head>
        <title>
          Proposal {proposal} - Contest {contestName ? contestName : address} - JokeDAO
        </title>
        <meta name="description" content="@TODO: change this" />
      </Head>
      <h1 className="sr-only">
        Proposal {proposal} - Contest {contestName ? contestName : address}{" "}
      </h1>
      {listProposalsData[proposal] && (
        <div className="mt-6 animate-appear">
          <ProposalContent
            author={listProposalsData[proposal]?.authorEthereumAddress}
            content={listProposalsData[proposal]?.content}
          />
          {contestStatus === CONTEST_STATUS.VOTING_OPEN &&
            proposal &&
            proposal !== null &&
            !isProposalDeleted(listProposalsData[proposal]?.content) && (
              <div className="flex flex-col items-center justify-center mt-10">
                <Button
                  isLoading={checkIfUserPassedSnapshotLoading}
                  intent={
                    currentUserAvailableVotesAmount === 0 ||
                    checkIfUserPassedSnapshotLoading ||
                    !didUserPassSnapshotAndCanVote
                      ? "primary-outline"
                      : "primary"
                  }
                  disabled={
                    !didUserPassSnapshotAndCanVote ||
                    checkIfUserPassedSnapshotLoading ||
                    currentUserAvailableVotesAmount === 0
                  }
                  onClick={onClickProposalVote}
                >
                  {!checkIfUserPassedSnapshotLoading ? "Cast your votes for this proposal" : "Checking snapshot..."}
                </Button>
                <span className="text-2xs mt-1 text-neutral-11">Available: {currentUserAvailableVotesAmount}</span>
                {
                  <p className="text-2xs mt-1 text-neutral-11">
                    {checkIfUserPassedSnapshotLoading
                      ? "Checking snapshot..."
                      : !didUserPassSnapshotAndCanVote
                      ? "Your wallet didn't qualify to vote."
                      : "Your wallet qualified to vote!"}
                  </p>
                }
              </div>
            )}
          {[CONTEST_STATUS.VOTING_OPEN, CONTEST_STATUS.COMPLETED].includes(contestStatus) && (
            <ProposalVotesWrapper>
              <div className="mt-8 text-sm">
                {/* @ts-ignore */}
                <ListProposalVotes id={proposal} />
              </div>
            </ProposalVotesWrapper>
          )}
        </div>
      )}
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }: any) {
  const { chain, address } = params;
  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    chains.filter(c => c.name.toLowerCase().replace(" ", "") === chain).length === 0
  ) {
    return { notFound: true };
  }

  try {
    return {
      props: {
        address,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
//@ts-ignore
Page.getLayout = getLayout;

export default Page;
