import { Proposal } from "@components/_pages/ProposalContent";
import SubmissionPage from "@components/_pages/Submission";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
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
  version: string;
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

  const data = await fetchProposalData(address, chainId, submission);

  const fetchNumberOfComments = async (address: string, chainId: number, submission: string) => {
    try {
      console.log("fetching contest contract version...");

      const { abi, version } = await getContestContractVersion(address, chainId);
      console.log(`contract abi: ${abi}, version: ${version}`);

      if (!abi) {
        console.log("abi not found.");
        return null;
      }

      const contracts = [
        {
          address,
          abi,
          chainId,
          functionName: "getProposalComments",
          args: [submission],
        },
        {
          address,
          abi,
          chainId,
          functionName: "getAllDeletedCommentIds",
          args: [],
        },
      ];

      console.log("reading contracts for comments...");
      //@ts-ignore
      const results = (await readContracts({ contracts })) as any;
      console.log("contracts read successfully.");
      const allCommentsIdsBigInt = results[0]?.result as bigint[];
      const deletedCommentIdsBigInt = results[1]?.result as bigint[];
      const deletedCommentIdsSet = new Set(deletedCommentIdsBigInt);

      const commentCount = allCommentsIdsBigInt.filter(id => !deletedCommentIdsSet.has(id)).length;
      console.log(`num of comments: ${commentCount}`);

      return commentCount;
    } catch (error: any) {
      console.log(`errr in fetchNumberOfComments: ${error.message}`);
      throw error; // Rethrow the error after logging
    }
  };

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
