import isUrlToImage from "@helpers/isUrlToImage";
import { chain, fetchEnsName, getAccount, readContract, watchContractEvent } from "@wagmi/core";
import { useRouter } from "next/router";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreContest } from "../useContest/store";
import useContest from "@hooks/useContest";
import { useEffect } from "react";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import { useProvider } from "wagmi";
/*
import { useContractEvent } from "wagmi";
import { useStore as useStoreSubmitProposal } from "../useSubmitProposal/store";
*/

export function useContestEvents() {
  const { asPath } = useRouter();
  const provider = useProvider()
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
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (canUpdateVotesInRealTime === false || contestStatus === CONTEST_STATUS.COMPLETED) {
      provider.removeAllListeners()

    } else  {
      // Only watch VoteCast events when voting is open and we are <=1h before end of voting
      if (contestStatus === CONTEST_STATUS.VOTING_OPEN && canUpdateVotesInRealTime === true) {
        watchContractEvent(
          {
            addressOrName: asPath.split("/")[3],
            contractInterface: DeployedContestContract.abi,
          },
          "VoteCast",
          (...args) => {
            onVoteCast(args);
          },
        );
      }
    }

  }, [canUpdateVotesInRealTime, contestStatus]);

useEffect(() => {
  watchContractEvent(
    {
      addressOrName: asPath.split("/")[3],
      contractInterface: DeployedContestContract.abi,
    },
    "VoteCast",
    (...args) => {
      onVoteCast(args);
    },
  );

  const onVisibilityChangeHandler = () => {
    if (document.visibilityState === 'hidden') {

      provider.removeAllListeners()

    } else {
      if (contestStatus === CONTEST_STATUS.VOTING_OPEN && canUpdateVotesInRealTime === true) {
              provider.addListener( "VoteCast",
      (...args) => {
        onVoteCast(args);
      },)

      }
    }
};

document.addEventListener(
    'visibilitychange',
    onVisibilityChangeHandler,
);

return () => {
  document.removeEventListener(
      'visibilitychange',
      onVisibilityChangeHandler,
  );
};

}, [])
  /*
  useContractEvent({
    addressOrName: asPath.split("/")[3],
    contractInterface: DeployedContestContract.abi,
    eventName: "ProposalsDeleted",
    listener: async event => {
      softDeleteProposal(event[0].toString());
    },
  });
  
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
