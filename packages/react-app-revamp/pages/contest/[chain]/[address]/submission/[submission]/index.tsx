import SubmissionPage from "@components/_pages/Submission";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import useFetchProposalData from "@hooks/useFetchProposalData";
import { getLayout } from "@layouts/LayoutViewContest";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

interface PageProps {
  address: string;
  chain: string;
  chainId: number;
  abi: any;
  version: string;
  submission: string;
}

const Page: FC<PageProps> = ({ address, chain, submission, abi, version, chainId }) => {
  const router = useRouter();
  const { contestPrompt, contestName } = useContestStore(state => state);
  const { data, loading, error } = useFetchProposalData(abi, version, address, chainId, submission);
  const { setPickedProposal } = useCastVotesStore(state => state);
  const id = router.query.submission as string;

  useEffect(() => {
    setPickedProposal(id);
  }, [id, setPickedProposal]);

  return (
    <>
      <Head>
        <title>{`proposal ${id} for ${contestName}`}</title>
      </Head>
      <SubmissionPage
        contestInfo={{
          address,
          chain,
          version,
        }}
        prompt={contestPrompt}
        proposalData={data}
        isProposalLoading={loading}
        isProposalError={error}
        proposalId={id}
      />
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

const getChainId = (chain: string) => {
  const chainId = chains.find(c => c.name.toLowerCase().replace(" ", "") === chain)?.id;

  if (chainId === undefined) {
    throw new Error(`Chain ID not found for chain: ${chain}`);
  }
  return chainId;
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
  const { abi, version } = await getContestContractVersion(address, chainId);

  return {
    props: {
      address,
      chain,
      submission,
      abi,
      version,
      chainId,
    },
  };
}

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
