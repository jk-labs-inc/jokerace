import create from "zustand";
import createContext from "zustand/context";
import { useAccount, useContractRead, useEnsName, useNetwork, useToken } from "wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { chains } from "@config/wagmi";
import { chain } from "wagmi";

export const { Provider, useStore } = createContext();

export const createStore = () => {
  return create(set => ({
    contestStatus: null,
    contestName: null,
    contestAuthor: null,
    submissionsOpen: null,
    votesOpen: null,
    votesClose: null,
    votingToken: null,
    votingTokenAddress: null,
    currentUserAvailableVotesAmount: null,
    listProposalsIds: [],
    isListProposalsLoading: true,
    setContestStatus: (state: number) => set({ contestStatus: state }),
    setContestName: (name: string) => set({ contestName: name }),
    setContestAuthor: (author: string) => set({ contestAuthor: author }),
    setSubmissionsOpen: (datetime: string) => set({ submissionsOpen: datetime }),
    setVotesOpen: (datetime: string) => set({ votesOpen: datetime }),
    setVotesClose: (datetime: string) => set({ votesClose: datetime }),
    setVotingToken: (token: any) => set({ votingToken: token }),
    setVotingTokenAddress: (address: any) => set({ votingTokenAddress: address }),
    setCurrentUserAvailableVotesAmount: (amount: number) => set({ currentUserAvailableVotesAmount: amount }),
    setListProposalsIds: (list: any) => set({ listProposalsIds: list }),
    setIsListProposalsLoading: (value: boolean) => set({ isListProposalsLoading: value }),
  }));
};

export const stateContest = {
  [0]: "Active (voting is open)",
  [1]: "Cancelled",
  [2]: "Queued (proposal submissions are open)",
  [3]: "Completed",
};

export function useContestData() {
  const { asPath } = useRouter();
  const url = asPath.split("/");
  const { activeChain } = useNetwork();
  const [chainId] = useState(chains.filter(chain => chain.name.toLowerCase() === url[2])?.[0]?.id);
  const [canFetch, setCanFetch] = useState(chainId === activeChain?.id);
  const address = url[3];
  const stateContest = useStore();
  const { data, error, isLoading } = useAccount();
  const nameRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "name",
    {
      chainId,
      onSuccess: data => stateContest.setContestName(data),
      enabled: canFetch,
    },
  );
  const contestAuthorRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "creator",
    {
      chainId,
      onSuccess: data => stateContest.setContestAuthor(data),
      enabled: canFetch,
    },
  );

  const contestAuthorENSRawData = useEnsName({
    address: stateContest?.contestAuthor,
    chainId,
    onSuccess: data => stateContest.setContestAuthor(data),
    enabled: activeChain?.id === chain.mainnet.id && canFetch && stateContest?.contestAuthor,
  });

  const tokenAddressRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "token",
    {
      chainId,
      enabled: canFetch,
      onSuccess: data => stateContest.setVotingTokenAddress(data),
    },
  );

  const tokenRawData = useToken({
    enabled: canFetch && stateContest.votingTokenAddress !== null,
    address: stateContest.votingTokenAddress,
    chainId,
  });

  const submissionsOpenRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "contestStart",
    {
      chainId,
      onSuccess: data => stateContest.setSubmissionsOpen(new Date(parseInt(data) * 1000)),
      enabled: canFetch,
    },
  );
  const deadlineRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "contestDeadline",
    {
      chainId,
      onSuccess: data => stateContest.setVotesClose(new Date(parseInt(data) * 1000)),
      enabled: canFetch,
    },
  );
  const votesOpenRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "voteStart",
    {
      chainId,
      enabled: canFetch,
      onSuccess: data => stateContest.setVotesOpen(new Date(parseInt(data) * 1000)),
    },
  );
  const statusRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "state",
    {
      chainId,
      enabled: canFetch,
      onSuccess: data => stateContest.setContestStatus(data),
    },
  );
  const amountOfTokensRequiredToSubmitEntryRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "proposalThreshold",
    {
      chainId,
      enabled: canFetch,
    },
  );
  const usersQualifyToVoteIfTheyHoldTokenAtTimeRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "contestSnapshot",
    {
      chainId,
      enabled: canFetch,
      onSuccess: data => stateContest.setVotesOpen(new Date(parseInt(data) * 1000)),
    },
  );
  const currentAddressTotalVotesRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "contestAddressTotalVotesCast",
    {
      chainId,
      cacheOnBlock: true,
      args: data?.address,
      enabled: data?.address && canFetch ? true : false,
      onSuccess: data => stateContest.setCurrentUserAvailableVotesAmount(data),
    },
  );

  const proposalsIdsRawData = useContractRead(
    {
      //@ts-ignore
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "getAllProposalIds",
    {
      chainId,
      enabled: canFetch,
      onSuccess: data => {
        stateContest.setListProposalsIds(data);
        stateContest.setIsListProposalsLoading(false);
      },
    },
  );

  useEffect(() => {
    if (activeChain?.id !== chainId) {
      setCanFetch(false);
    } else {
      setCanFetch(true);
    }
  }, [activeChain]);

  useEffect(() => {
    if (activeChain?.id === chainId && tokenRawData?.data) {
      stateContest.setVotingToken(tokenRawData.data);
    }
  }, [activeChain?.id, tokenRawData.data]);

  const datalist = [
    statusRawData,
    contestAuthorRawData,
    submissionsOpenRawData,
    usersQualifyToVoteIfTheyHoldTokenAtTimeRawData,
    amountOfTokensRequiredToSubmitEntryRawData,
    nameRawData,
    tokenAddressRawData,
    tokenRawData,
    currentAddressTotalVotesRawData,
    deadlineRawData,
    votesOpenRawData,
  ];

  return {
    isLoading:
      !canFetch ||
      !tokenRawData.data ||
      isLoading ||
      datalist.filter(e => e.isFetching === false && e.isLoading === false && e.isRefetching === false && e.isSuccess)
        .length < datalist.length,
  };
}
