import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import shallow from "zustand/shallow";
import { chain, useConnect, useContractEvent, useNetwork } from "wagmi";
import { fetchEnsName, readContract } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreContest } from "../useContest/store";
import { chains } from "@config/wagmi";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useStore } from "./store";

export function useProposalVotes(id: number | string) {
  const { asPath } = useRouter();
  const { activeConnector } = useConnect();
  const { activeChain } = useNetwork();
  const [url] = useState(asPath.split("/"));
  const [chainId, setChainId] = useState(chains.filter(chain => chain.name.toLowerCase() === url[2])?.[0]?.id);
  const [address] = useState(url[3]);

  const { listProposalsData } = useStoreContest(
    state => ({
      //@ts-ignore
      listProposalsData: state.listProposalsData,
    }),
    shallow,
  );

  const {
    isListVotersSuccess,
    isListVotersError,
    isListVotersLoading,
    setIsListVotersLoading,
    setIsListVotersError,
    setVotesPerAddress,
    setIsListVotersSuccess,
  } = useStore(
    state => ({
      //@ts-ignore
      isListVotersSuccess: state.isListVotersSuccess,
      //@ts-ignore
      isListVotersError: state.isListVotersError,
      //@ts-ignore
      isListVotersLoading: state.isListVotersLoading,
      //@ts-ignore
      setVotesPerAddress: state.setVotesPerAddress,
      //@ts-ignore
      setIsListVotersLoading: state.setIsListVotersLoading,
      //@ts-ignore
      setIsListVotersError: state.setIsListVotersError,
      //@ts-ignore
      setIsListVotersSuccess: state.setIsListVotersSuccess,
    }),
    shallow,
  );

  async function fetchProposalVotes() {
    setIsListVotersLoading(true);
    try {
      const contractConfig = {
        addressOrName: address,
        contractInterface: DeployedContestContract.abi,
      };
      const list = await readContract(contractConfig, "proposalAddressesHaveVoted", {
        chainId,
        args: id,
      });

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
      setIsListVotersSuccess(true);
      setIsListVotersError(null);
      setIsListVotersLoading(false);
    } catch (e) {
      //@ts-ignore
      setIsListVotersError(e?.code ?? e);
      setIsListVotersSuccess(false);
      setIsListVotersLoading(false);
      //@ts-ignore
      toast.error(e?.message ?? e);
    }
  }

  useEffect(() => {
    if (activeChain?.id === chainId && listProposalsData[id] && listProposalsData[id]?.votes > 0) {
      fetchProposalVotes();
    }
  }, [activeChain?.id, chainId, listProposalsData[id]?.votes]);

  useEffect(() => {
    if (activeConnector) {
      activeConnector.on("change", data => {
        //@ts-ignore
        setChainId(data.chain.id);
      });
    }
  }, [activeConnector]);

  useContractEvent(
    {
      addressOrName: asPath.split("/")[3],
      contractInterface: DeployedContestContract.abi,
    },
    "VoteCast",
    async event => {
      await fetchProposalVotes();
    },
  );

  return {
    isLoading: isListVotersLoading,
    retry: fetchProposalVotes,
    isSuccess: isListVotersSuccess,
    isError: isListVotersError,
  };
}

export default useProposalVotes;
