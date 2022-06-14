import create from "zustand";
import createContext from "zustand/context";
import shallow from "zustand/shallow";
import { useContractRead, useNetwork } from "wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreContest } from "./../useContest";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { chains } from "@config/wagmi";
import { chain, fetchEnsName, readContract } from "@wagmi/core";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";

export const createStore = () => {
  return create(set => ({
    votes: 0,
    isListVotersLoading: true,
    votesPerAddress: {},
    //@ts-ignore
    setVotesPerAddress: ({ address, value }) =>
      set(state => ({
        ...state,
        votesPerAddress: {
          //@ts-ignore
          ...state.votesPerAddress,
          [address]: value,
        },
      })),
    setIsListVotersLoading: (value: boolean) => set({ isListVotersLoading: value }),
    setNumberofVotes: (amount: number) => set({ votes: amount }),
  }));
};

export const { Provider, useStore } = createContext();

export function useProposal() {
  const { asPath } = useRouter();
  const [url] = useState(asPath.split("/"));
  const { activeChain } = useNetwork();
  const [chainId] = useState(chains.filter(chain => chain.name.toLowerCase() === url[2])?.[0]?.id);
  const [canFetch, setCanFetch] = useState(chainId === activeChain?.id);
  const [address] = useState(url[3]);
  const [id] = useState(url[4]);

  const { listProposalsData } = useStoreContest(
    state => ({
      //@ts-ignore
      listProposalsData: state.listProposalsData,
    }),
    shallow,
  );

  const { votes, setNumberofVotes, setIsListVotersLoading, setVotesPerAddress, isListVotersLoading } = useStore(
    state => ({
      //@ts-ignore
      votes: state.votes,
      //@ts-ignore
      setNumberofVotes: state.setNumberofVotes,
      //@ts-ignore
      isListVotersLoading: state.isListVotersLoading,
      //@ts-ignore
      setVotesPerAddress: state.setVotesPerAddress,
      //@ts-ignore
      setIsListVotersLoading: state.setIsListVotersLoading,
    }),
    shallow,
  );

  const proposalVotesRawData = useContractRead(
    {
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "proposalVotes",
    {
      chainId,
      args: id,
      onSuccess: data => {
        //@ts-ignore
        setNumberofVotes(data / 1e18);
      },
    },
  );

  const proposalVotersRawData = useContractRead(
    {
      addressOrName: address,
      contractInterface: DeployedContestContract.abi,
    },
    "proposalAddressesHaveVoted",
    {
      chainId,
      args: id,
      enabled: canFetch && listProposalsData[id] && proposalVotesRawData.isSuccess && votes > 0,
      onSuccess: data => {
        //@ts-ignore
        fetchVotesPerAddress(data);
      },
    },
  );

  async function fetchVotesPerAddress(list: Array<string>) {
    try {
      Promise.all(
        list.map(async (userAddress: string) => {
          const data = await readContract(
            {
              //@ts-ignore
              addressOrName: address,
              contractInterface: DeployedContestContract.abi,
            },
            "contestAddressTotalVotesCast",
            {
              args: userAddress,
              chainId,
            },
          );

          const author = await fetchEnsName({
            address: userAddress,
            chainId: chain.mainnet.id,
          });
          setVotesPerAddress({
            address: userAddress,
            value: {
              displayAddress: author ?? shortenEthereumAddress(userAddress),
              votes: data / 1e18,
            },
          });
        }),
      );
      setIsListVotersLoading(false);
    } catch (e) {
      console.error(e);
      setIsListVotersLoading(false);
    }
  }

  const datalist = [proposalVotesRawData, proposalVotersRawData];

  useEffect(() => {
    if (activeChain?.id !== chainId) {
      setCanFetch(false);
    } else {
      setCanFetch(true);
    }
  }, [activeChain]);

  return {
    isLoading:
      !canFetch ||
      isListVotersLoading ||
      datalist.filter(e => e.isFetching === false && e.isLoading === false && e.isRefetching === false && e.isSuccess)
        .length < datalist.length,
  };
}

export default useProposal;
