import DialogModalProposal from "@components/_pages/DialogModalProposal";
import { Proposal } from "@components/_pages/ProposalContent";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import isUrlToImage from "@helpers/isUrlToImage";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useContestStore } from "@hooks/useContest/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { getLayout } from "@layouts/LayoutViewContest";
import { readContracts } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";

interface PageProps {
  address: string;
  chain: string;
  proposalData: Proposal;
}

const Page: FC<PageProps> = ({ proposalData, address, chain }) => {
  const router = useRouter();
  const { contestPrompt, contestName } = useContestStore(state => state);
  const { listProposalsData } = useProposalStore(state => state);
  const id = router.query.submission as string;
  const proposal = listProposalsData[id] || proposalData;

  const onModalClose = () => {
    router.push(`/contest/${chain}/${address}`, undefined, { shallow: true, scroll: false });
  };

  return (
    <>
      <Head>
        <title>
          proposal by {shortenEthereumAddress(proposal.authorEthereumAddress)} for {contestName}
        </title>
      </Head>
      <DialogModalProposal
        proposalId={id}
        prompt={contestPrompt}
        isOpen={true}
        proposal={proposal}
        onClose={onModalClose}
      />
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

const getChainId = (chain: string) => {
  return chains.find(c => c.name.toLowerCase().replace(" ", "") === chain)?.id;
};

const fetchProposalData = async (address: string, chainId: number, submission: string) => {
  const { abi } = await getContestContractVersion(address, chainId);
  const contracts = [
    {
      address,
      abi,
      chainId,
      functionName: "getProposal",
      args: [submission],
    },
    {
      address,
      abi,
      chainId,
      functionName: "proposalVotes",
      args: [submission],
    },
  ];

  //@ts-ignore
  const results = (await readContracts({ contracts })) as any;
  const data = results[0].result;

  const isContentImage = isUrlToImage(data.description);
  const forVotesBigInt = results[1].result[0] as bigint;
  const againstVotesBigInt = results[1].result[1] as bigint;
  const votesBigNumber = BigNumber.from(forVotesBigInt).sub(againstVotesBigInt);
  const votes = Number(utils.formatEther(votesBigNumber));

  return {
    authorEthereumAddress: data.author,
    content: data.description,
    isContentImage,
    exists: data.exists,
    votes,
  };
};

export async function getStaticProps({ params }: any) {
  const { chain, address, submission } = params;

  if (
    !REGEX_ETHEREUM_ADDRESS.test(address) ||
    !chains.some(c => c.name.toLowerCase().replace(" ", "") === chain) ||
    !submission
  ) {
    return { notFound: true };
  }

  try {
    const chainId = getChainId(chain);

    if (!chainId) return;
    const proposalData = await fetchProposalData(address, chainId, submission);

    return {
      props: {
        address,
        chain,
        proposalData,
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
