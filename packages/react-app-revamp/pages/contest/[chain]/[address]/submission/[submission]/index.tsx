import { Proposal } from "@components/_pages/ProposalContent";
import SubmissionPage from "@components/_pages/Submission";
import { chains } from "@config/wagmi";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { getLayout } from "@layouts/LayoutViewContest";
import { fetchProposalData } from "lib/proposal";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

interface PageProps {
  address: string;
  chain: string;
  version: number;
  proposal: Proposal | null;
  numberOfComments: number;
}

const Page: FC<PageProps> = ({ address, chain, version, proposal, numberOfComments }) => {
  const router = useRouter();
  const { contestPrompt, contestName } = useContestStore(state => state);
  const { setPickedProposal } = useCastVotesStore(state => state);
  const id = router.query.submission as string;

  useEffect(() => {
    setPickedProposal(id);
  }, [id, setPickedProposal]);

  console.log("version in submission page", version);

  return (
    <>
      <Head>
        <title>
          {proposal ? `proposal by ${shortenEthereumAddress(proposal.authorEthereumAddress)} for ${contestName}` : null}
        </title>
      </Head>
      <SubmissionPage
        contestInfo={{
          address,
          chain,
          version,
        }}
        prompt={contestPrompt}
        proposal={proposal}
        proposalId={id}
        numberOfComments={numberOfComments}
      />
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const getChainId = (chain: string) => {
  return chains.find(c => c.name.toLowerCase().replace(" ", "") === chain)?.id;
};

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps({ params }: any) {
  const { chain, address, submission } = params;

  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    !chains.some(c => c.name.toLowerCase().replace(" ", "") === chain) ||
    !submission
  ) {
    return { notFound: true };
  }

  const chainId = getChainId(chain);

  if (!chainId) return;

  const data = await fetchProposalData(address, chainId, submission);

  return {
    props: {
      address,
      chain,
      version: data?.version,
      proposal: data?.proposal,
      numberOfComments: data?.numberOfComments,
    },
  };
}

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
