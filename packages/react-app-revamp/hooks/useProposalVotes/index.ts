import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import shallow from "zustand/shallow";
import { chain as wagmiChain, useAccount, useContractEvent } from "wagmi";
import { fetchEnsName, readContract } from "@wagmi/core";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { chains } from "@config/wagmi";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useStore } from "./store";
import getContestContractVersion from "@helpers/getContestContractVersion";
import arrayToChunks from "@helpers/arrayToChunks";

const VOTES_PER_PAGE = 5;

export function useProposalVotes(id: number | string) {
  const { asPath } = useRouter();
  const account = useAccount();
  const [url] = useState(asPath.split("/"));
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === url[2])?.[0]?.id,
  );
  const [address] = useState(url[3]);

  const {
    isListVotersSuccess,
    isListVotersError,
    isListVotersLoading,
    setIsListVotersLoading,
    setIsListVotersError,
    setVotesPerAddress,
    setIsListVotersSuccess,
    setIsPageVotesLoading,
    setIsPageVotesError,
    setCurrentPagePaginationVotes,
    setIndexPaginationVotesPerId,
    setTotalPagesPaginationVotes,
    setHasPaginationVotesNextPage,
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
      //@ts-ignore
      setIsPageVotesLoading: state.setIsPageVotesLoading,
      //@ts-ignore
      setIsPageVotesSuccess: state.setIsPageVotesSuccess,
      //@ts-ignore
      setIsPageVotesError: state.setIsPageVotesError,
      //@ts-ignore
      setCurrentPagePaginationVotes: state.setCurrentPagePaginationVotes,
      //@ts-ignore
      setIndexPaginationVotesPerId: state.setIndexPaginationVotesPerId,
      //@ts-ignore
      setTotalPagesPaginationVotes: state.setTotalPagesPaginationVotes,
      //@ts-ignore
      setHasPaginationVotesNextPage: state.setHasPaginationVotesNextPage,
    }),
    shallow,
  );

  /**
   * Fetch all votes of a given proposals (amount of votes, + detailed list of voters and the amount of votes they casted)
   */
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

      // Pagination
      const totalPagesPaginationVotes = Math.ceil(list?.length / VOTES_PER_PAGE);
      setTotalPagesPaginationVotes(totalPagesPaginationVotes);
      setCurrentPagePaginationVotes(0);
      //@ts-ignore
      const paginationChunks = arrayToChunks(list, VOTES_PER_PAGE);
      setTotalPagesPaginationVotes(paginationChunks.length);
      setIndexPaginationVotesPerId(paginationChunks);
      if (list.length > 0) await fetchVotesPage(0, paginationChunks[0], paginationChunks.length);
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

  /**
   * Fetch the data of each vote in page X
   * @param pageIndex - index of the page of votes to fetch
   * @param slice - Array of the addresses that have cast a vote for a given proposal
   * @param totalPagesPaginationVotes - total of pages in the pagination
   */
  async function fetchVotesPage(pageIndex: number, slice: Array<any>, totalPagesPaginationVotes: number) {
    setCurrentPagePaginationVotes(pageIndex);
    setIsPageVotesLoading(true);
    setIsPageVotesError(null);
    try {
      await Promise.all(
        slice.map(async (userAddress: string) => {
          await fetchVotesOfAddress(userAddress);
        }),
      );

      setIsPageVotesLoading(false);
      setIsPageVotesError(null);
      setHasPaginationVotesNextPage(pageIndex + 1 < totalPagesPaginationVotes);
    } catch (e) {
      setIsPageVotesLoading(false);
      //@ts-ignore
      setIsPageVotesError(e?.message ?? e);
      //@ts-ignore
      toast.error(e?.message ?? e);
    }
  }

  /**
   * Fetch the data of a votes for a given wallet
   * @param userAddress - wallet address
   */
  async function fetchVotesOfAddress(userAddress: string) {
    const chainName = asPath.split("/")[2];

    try {
      const abi = await getContestContractVersion(address, chainName);
      if (abi === null) {
        toast.error("This contract doesn't exist on this chain.");
        setIsPageVotesError("This contract doesn't exist on this chain.");
        setIsPageVotesLoading(false);
        return;
      }
      const contractConfig = {
        addressOrName: address,
        contractInterface: abi,
        chainId: chainId,
      };

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
    } catch (e) {
      console.error(e);
      //@ts-ignore
      toast.error(e?.message ?? e);
    }
  }

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
    listener: event => {
      fetchVotesOfAddress(event[0]);
    },
  });

  return {
    isLoading: isListVotersLoading,
    retry: fetchProposalVotes,
    isSuccess: isListVotersSuccess,
    isError: isListVotersError,
    fetchVotesPage: fetchVotesPage,
  };
}

export default useProposalVotes;
