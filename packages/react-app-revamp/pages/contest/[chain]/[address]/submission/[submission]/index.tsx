import SubmissionPage from "@components/_pages/Submission";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import useFetchProposalData from "@hooks/useFetchProposalData";
import { getLayout } from "@layouts/LayoutViewContest";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
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
  const chainId = chains.find((c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain)?.id;

  if (chainId === undefined) {
    throw new Error(`Chain ID not found for chain: ${chain}`);
  }
  return chainId;
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params, req } = context;
  const address = Array.isArray(params?.address) ? params?.address[0] : params?.address;
  const chain = Array.isArray(params?.chain) ? params?.chain[0] : params?.chain;
  const submission = Array.isArray(params?.submission) ? params?.submission[0] : params?.submission;
  const cookie = req?.headers.cookie || "";

  if (
    !address ||
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    !chains.some((c: { name: string }) => c.name.toLowerCase().replace(" ", "") === chain) ||
    !submission
  ) {
    return { notFound: true };
  }

  const chainId = getChainId(chain ?? "");
  const { abi, version } = await getContestContractVersion(address, chainId);

  return {
    props: {
      address,
      chain,
      chainId,
      submission,
      abi,
      version,
      cookie,
    },
  };
};

//@ts-ignore
Page.getLayout = getLayout;

export default Page;
