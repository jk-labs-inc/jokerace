import isUrlToImage from "@helpers/isUrlToImage";
import { chain, fetchEnsName, getAccount, readContract, getContract, watchContractEvent } from "@wagmi/core";
import { useRouter } from "next/router";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreContest } from "../useContest/store";
import useContest from "@hooks/useContest";
import { useEffect } from "react";
import { CONTEST_STATUS } from "@helpers/contestStatus";

/*
import { useContractEvent, useContract, useProvider } from "wagmi";
import { useStore as useStoreSubmitProposal } from "../useSubmitProposal/store";
import { hoursToMilliseconds, isAfter, isBefore, isEqual } from "date-fns";
import { useStore as useStoreSubmitProposal } from "../useSubmitProposal/store";
*/

export function useContestEvents() {
  const { asPath } = useRouter();
  // const storeSubmitProposal = useStoreSubmitProposal();
  const {
    //@ts-ignore
    contestStatus,
    //@ts-ignore
    setProposalData,
    //@ts-ignore
    setProposalVotes,
    //@ts-ignore
    listProposalsData,
    //@ts-ignore
    canUpdateVotesInRealTime,
  } = useStoreContest();
  const { updateCurrentUserVotes } = useContest();

  /**
   * Callback function triggered on "VoteCast" event
   * @param args - Array of the following values: from, to, value, event|event[]
   */
  async function onVoteCast(args: Array<any>) {
    try {
      const accountData = await getAccount();
      // if the connected wallet is the address that casted votes
      if (accountData?.address && args[0] === accountData?.address) {
        // Update the current user available votes
        updateCurrentUserVotes();
      }
  
      const proposalId = args[5].args.proposalId;
      const votes = await readContract({
        addressOrName: asPath.split("/")[3],
        contractInterface: DeployedContestContract.abi,
        functionName: "proposalVotes",
        args: proposalId,
      });
  
      if (listProposalsData[proposalId]) {
        //@ts-ignore
        setProposalVotes({
          id: proposalId,
          //@ts-ignore
          votes: votes?.forVotes ? votes?.forVotes / 1e18 - votes?.againstVotes / 1e18 : votes / 1e18,
        });
      } else {
        const proposal = await readContract({
          addressOrName: asPath.split("/")[3],
          contractInterface: DeployedContestContract.abi,
          functionName: "getProposal",
          args: proposalId,
        });
        const author = await fetchEnsName({
          address: proposal[0],
          chainId: chain.mainnet.id,
        });
        const proposalData: any = {
          authorEthereumAddress: proposal[0],
          author: author ?? proposal[0],
          content: proposal[1],
          isContentImage: isUrlToImage(proposal[1]) ? true : false,
          exists: proposal[2],
          //@ts-ignore
          votes: votes?.forVotes ? votes?.forVotes / 1e18 - votes?.againstVotes / 1e18 : votes / 1e18,
        };
  
        setProposalData({ id: proposalId, data: proposalData });
      }
  
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if(canUpdateVotesInRealTime === true) {
          // Only watch VoteCast events when voting is open and we are <=1h before end of voting
        if(contestStatus === CONTEST_STATUS.VOTING_OPEN) {
        watchContractEvent({
          addressOrName: asPath.split("/")[3],
          contractInterface: DeployedContestContract.abi,
        }, 
        "VoteCast", (...args) => {
          onVoteCast(args)
        })
      }
      // When voting closes, remove all event listeners
      if(contestStatus === CONTEST_STATUS.COMPLETED) {
        const contract = getContract({
          addressOrName: asPath.split("/")[3],
          contractInterface: DeployedContestContract.abi,
  
        })
        contract.removeAllListeners()
      }
    }

  }, [canUpdateVotesInRealTime, contestStatus])
  /*
  const {
    removeAllListeners
  } = useContract({
    addressOrName: asPath.split("/")[3],
    contractInterface: DeployedContestContract.abi,
  })

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
  });
  
  if (isAfter(new Date(), votesClose - hoursToMilliseconds(1)) || isBefore(new Date(), votesClose) || isEqual(new Date(), votesClose)) {
    useContractEvent({
      addressOrName: asPath.split("/")[3],
      contractInterface: DeployedContestContract.abi,
      eventName: "VoteCast",

      listener: async event => {
        const accountData = await getAccount();
        // if the connected wallet is the address that casted votes
        if (accountData?.address && event[0] === accountData?.address) {
          // Update the current user available votes
          updateCurrentUserVotes();
        }

        const proposalId = event[5].args.proposalId;
        const votes = await readContract({
          addressOrName: asPath.split("/")[3],
          contractInterface: DeployedContestContract.abi,
          functionName: "proposalVotes",
          args: proposalId,
        });

        if (listProposalsData[proposalId]) {
          //@ts-ignore
          setProposalVotes({
            id: proposalId,
            //@ts-ignore
            votes: votes?.forVotes ? votes?.forVotes / 1e18 - votes?.againstVotes / 1e18 : votes / 1e18,
          });
        } else {
          const proposal = await readContract({
            addressOrName: asPath.split("/")[3],
            contractInterface: DeployedContestContract.abi,
            functionName: "getProposal",
            args: proposalId,
          });
          const author = await fetchEnsName({
            address: proposal[0],
            chainId: chain.mainnet.id,
          });
          const proposalData: any = {
            authorEthereumAddress: proposal[0],
            author: author ?? proposal[0],
            content: proposal[1],
            isContentImage: isUrlToImage(proposal[1]) ? true : false,
            exists: proposal[2],
            //@ts-ignore
            votes: votes?.forVotes ? votes?.forVotes / 1e18 - votes?.againstVotes / 1e18 : votes / 1e18,
          };

          setProposalData({ id: proposalId, data: proposalData });
        }
      },
    });
  };

  if (isAfter(new Date(), votesClose)) {
    removeAllListeners();
  }
  
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
  */
}

export default useContestEvents;
