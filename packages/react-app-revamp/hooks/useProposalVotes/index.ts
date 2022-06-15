import create from "zustand";
import createContext from "zustand/context";
import shallow from "zustand/shallow";
import { useContractRead, useNetwork } from "wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreContest } from "../useContest";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { chains } from "@config/wagmi";
import { chain, fetchEnsName, readContract } from "@wagmi/core";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";

export const createStore = () => {
  return create(set => ({
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
  }));
};

export const { Provider, useStore } = createContext();

export function useProposalVotes() {
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

  const { setIsListVotersLoading, setVotesPerAddress, isListVotersLoading } = useStore(
    state => ({
      //@ts-ignore
      isListVotersLoading: state.isListVotersLoading,
      //@ts-ignore
      setVotesPerAddress: state.setVotesPerAddress,
      //@ts-ignore
      setIsListVotersLoading: state.setIsListVotersLoading,
    }),
    shallow,
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
      enabled: canFetch && listProposalsData[id] && listProposalsData[id].votes > 0,
      onSuccess: data => {
        //@ts-ignore
        fetchVotesPerAddress(data);
      },
    },
  );

  async function fetchVotesPerAddress(list: Array<string>) {
    try {
      await Promise.all(
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
              //@ts-ignore
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

  useEffect(() => {
    if (activeChain?.id !== chainId) {
      setCanFetch(false);
    } else {
      setCanFetch(true);
    }
  }, [activeChain]);

  const datalist = [proposalVotersRawData];

  return {
    isLoading:
      isListVotersLoading ||
      datalist.filter(e => e.isFetching === false && e.isLoading === false && e.isRefetching === false && e.isSuccess)
        .length < datalist.length,
    retry: async () => {
      await Promise.all(
        datalist
          .filter(e => e.isError)
          .map(async fn => {
            await fn.refetch();
          }),
      );
    },
    isSuccess: datalist.filter(e => e.isSuccess).length === datalist.length,
    isError: datalist.filter(e => e.isError).length > 0,
  };
}

export default useProposalVotes;
