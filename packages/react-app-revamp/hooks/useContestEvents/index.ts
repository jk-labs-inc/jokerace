import isUrlToImage from "@helpers/isUrlToImage";
import { chain, fetchEnsName, readContract } from "@wagmi/core";
import { useRouter } from "next/router";
import { useContractEvent } from "wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreSubmitProposal } from "../useSubmitProposal/store";
import { useStore as useStoreContest } from "../useContest/store";

export function useContestEvents() {
  const { asPath } = useRouter();
  const storeSubmitProposal = useStoreSubmitProposal();
  const {
    //@ts-ignore
    setProposalData,
    //@ts-ignore
    addProposalId,
    //@ts-ignore
    setProposalVotes,
    //@ts-ignore,
    softDeleteProposal,
  } = useStoreContest();

  useContractEvent({
    addressOrName: asPath.split("/")[3],
    contractInterface: DeployedContestContract.abi,
    eventName: "ProposalCreated",
    listener: async event => {
      const proposalContent = event[3].args.description;
      const proposalAuthor = event[3].args.proposer;
      const proposalId = event[3].args.proposalId.toString();

      const author = await fetchEnsName({
        address: proposalAuthor,
        chainId: chain.mainnet.id,
      });

      const proposalData = {
        author: author ?? proposalAuthor,
        content: proposalContent,
        isContentImage: isUrlToImage(proposalContent) ? true : false,
        exists: true,
        //@ts-ignore
        votes: 0,
      };

      addProposalId(proposalId);
      setProposalData({ id: proposalId, data: proposalData });

      updateProposalTransactionData(event[3].transactionHash, proposalId);
    },
  });

  useContractEvent({
    addressOrName: asPath.split("/")[3],
    contractInterface: DeployedContestContract.abi,
    eventName: "ProposalsDeleted",
    listener: async event => {
      softDeleteProposal(event[0].toString());
    },
  })

  useContractEvent({
    addressOrName: asPath.split("/")[3],
    contractInterface: DeployedContestContract.abi,
    eventName: "VoteCast",

    listener: async event => {
      const proposalId = event[5].args.proposalId;
      const votes = await readContract({
        addressOrName: asPath.split("/")[3],
        contractInterface: DeployedContestContract.abi,
        functionName: "proposalVotes",
        args: proposalId,
      });

      //@ts-ignore
      setProposalVotes({ id: proposalId, votes: votes / 1e18 });
    },
  });

  function updateProposalTransactionData(transactionHash: string, proposalId: string | number) {
    //@ts-ignore
    if (storeSubmitProposal.transactionData?.hash === transactionHash) {
      //@ts-ignore
      storeSubmitProposal.setTransactionData({
        //@ts-ignore
        ...storeSubmitProposal.transactionData,
        proposalId,
      });
    }
  }
}

export default useContestEvents;
