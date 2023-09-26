import DialogModalProposal from "@components/_pages/DialogModalProposal";
import { Proposal } from "@components/_pages/ProposalContent";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import isUrlToImage from "@helpers/isUrlToImage";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { getLayout } from "@layouts/LayoutViewContest";
import { readContracts } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

interface PageProps {
  address: string;
  chain: string;
  proposal: Proposal;
}

const Page: FC<PageProps> = ({ proposal, address, chain }) => {
  const router = useRouter();
  const { contestPrompt, contestName } = useContestStore(state => state);
  const { setPickedProposal } = useCastVotesStore(state => state);
  const id = router.query.submission as string;

  useEffect(() => {
    setPickedProposal(id);
  }, [id, setPickedProposal]);

  const onModalClose = () => {
    router.push(`/contest/${chain}/${address}`, undefined, { shallow: true, scroll: false });
  };

  return (
    <>
      {proposal && (
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
      )}
    </>
  );
};

const REGEX_ETHEREUM_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

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
    {
      address,
      abi,
      chainId,
      functionName: "isProposalDeleted",
      args: [submission],
    },
  ];

  //@ts-ignore
  const results = (await readContracts({ contracts })) as any;
  const data = results[0].result;

  const isDeleted = results[2].result;

  const content = isDeleted ? "This proposal has been deleted by the creator" : data.description;
  const isContentImage = isUrlToImage(data.description);
  const forVotesBigInt = results[1].result[0] as bigint;
  const againstVotesBigInt = results[1].result[1] as bigint;
  const votesBigNumber = BigNumber.from(forVotesBigInt).sub(againstVotesBigInt);
  const votes = Number(utils.formatEther(votesBigNumber));

  return {
    authorEthereumAddress: data.author,
    content: content,
    isContentImage,
    exists: data.exists,
    votes,
  };
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

  try {
    const chainId = getChainId(chain);

    if (!chainId) return;
    const proposal = await fetchProposalData(address, chainId, submission);

    return {
      props: {
        address,
        chain,
        proposal,
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
