import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import shallow from "zustand/shallow";
import { chain as wagmiChain, useAccount, useContractEvent, useNetwork } from "wagmi";
import { fetchEnsName, readContract } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { useStore as useStoreContest } from "../useContest/store";
import { chains } from "@config/wagmi";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useStore } from "./store";
import getContestContractVersion from "@helpers/getContestContractVersion";

export function useProposalVotes(id: number | string) {
  const { asPath } = useRouter();
  const account = useAccount();
  const { chain } = useNetwork();
  const [url] = useState(asPath.split("/"));
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === url[2])?.[0]?.id,
  );
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
      version: state.version,
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
    const chainName = url[2];
    const abi = await getContestContractVersion(address, chainName);
    if (abi === null) {
      setIsListVotersLoading(false);
      setIsListVotersError("This contract doesn't exist on this chain.");
      setIsListVotersSuccess(false);
      setIsListVotersLoading(false);
      toast.error("This contract doesn't exist on this chain.");
      return;
    }
    try {
      const contractConfig = {
        addressOrName: address,
        contractInterface: abi,
        chainId: chainId,
      };
      const list = await readContract({
        ...contractConfig,
        chainId,
        functionName: "proposalAddressesHaveVoted",
        args: id,
      });

      await Promise.all(
        list.map(async (userAddress: string) => {
          const data = await readContract({
            //@ts-ignore
            ...contractConfig,
            functionName: "proposalAddressVotes",
            args: [id, userAddress],
            chainId,
          });

          const author = await fetchEnsName({
            address: userAddress,
            chainId: wagmiChain.mainnet.id,
          });
          setVotesPerAddress({
            address: userAddress,
            value: {
              displayAddress: author ?? shortenEthereumAddress(userAddress),
              //@ts-ignore
              votes: data?.forVotes ? data?.forVotes / 1e18 - data?.againstVotes / 1e18 : data / 1e18,
            },
          });
        }),
      );
      setIsListVotersSuccess(true);
      setIsListVotersError(null);
      setIsListVotersLoading(false);
    } catch (e) {
      console.error(e);
      //@ts-ignore
      setIsListVotersError(e?.code ?? e);
      setIsListVotersSuccess(false);
      setIsListVotersLoading(false);
      //@ts-ignore
      toast.error(e?.message ?? e);
    }
  }

  useEffect(() => {
    if (chain?.id === chainId && listProposalsData[id] && listProposalsData[id]?.votes > 0) {
      fetchProposalVotes();
    }
  }, [chain?.id, chainId, listProposalsData[id]?.votes]);

  useEffect(() => {
    if (account?.connector) {
      account?.connector.on("change", data => {
        //@ts-ignore
        setChainId(data.chain.id);
      });
    }
  }, [account?.connector]);

  useEffect(() => {
    fetchProposalVotes();
  }, []);

  useContractEvent({
    addressOrName: asPath.split("/")[3],
    contractInterface: DeployedContestContract.abi,
    eventName: "VoteCast",
    listener: async event => {
      await fetchProposalVotes();
    },
  });

  return {
    isLoading: isListVotersLoading,
    retry: fetchProposalVotes,
    isSuccess: isListVotersSuccess,
    isError: isListVotersError,
  };
}

export default useProposalVotes;
