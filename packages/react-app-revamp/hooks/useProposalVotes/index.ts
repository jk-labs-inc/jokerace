import { toastError } from "@components/UI/Toast";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { chains } from "@config/wagmi";
import arrayToChunks from "@helpers/arrayToChunks";
import { getEthersProvider } from "@helpers/ethers";
import getContestContractVersion from "@helpers/getContestContractVersion";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { useError } from "@hooks/useError";
import { fetchEnsName, getAccount, readContract } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useProposalVotesStore } from "./store";

const VOTES_PER_PAGE = 5;

export function useProposalVotes(id: number | string) {
  const { asPath } = useRouter();
  const account = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const [url] = useState(asPath.split("/"));
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === url[2])?.[0]?.id,
  );
  const provider = getEthersProvider({ chainId });
  const [address] = useState(url[3]);
  const { error, handleError } = useError();
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
  } = useProposalVotesStore(state => state);

  /**
   * Fetch all votes of a given proposals (amount of votes, + detailed list of voters and the amount of votes they casted)
   */
  async function fetchProposalVotes() {
    setIsListVotersLoading(true);

    const { abi } = await getContestContractVersion(address, chainId);

    if (abi === null) {
      const errorMessage = "This contract doesn't exist on this chain.";
      setIsListVotersLoading(false);
      setIsListVotersError(errorMessage);
      setIsListVotersSuccess(false);
      setIsListVotersLoading(false);
      toastError(errorMessage);
      return;
    }
    try {
      const accountData = getAccount();

      const list = (await readContract({
        address: address as `0x${string}`,
        abi: abi as any,
        chainId,
        functionName: "proposalAddressesHaveVoted",
        args: [id],
      })) as any;

      const usersListWithCurrentUserFirst = Array.from(list);
      // Make sure that current user address appears first in the list
      if (accountData?.address && list.includes(accountData?.address)) {
        const indexToSwitch = list.indexOf(accountData?.address);
        const addressToBeSwitchedPositionWith = usersListWithCurrentUserFirst[0];
        usersListWithCurrentUserFirst[0] = accountData?.address;
        usersListWithCurrentUserFirst[indexToSwitch] = addressToBeSwitchedPositionWith;
      }
      // Pagination
      const totalPagesPaginationVotes = Math.ceil(list?.length / VOTES_PER_PAGE);
      setTotalPagesPaginationVotes(totalPagesPaginationVotes);
      setCurrentPagePaginationVotes(0);
      //@ts-ignore
      const paginationChunks = arrayToChunks(usersListWithCurrentUserFirst, VOTES_PER_PAGE);
      setTotalPagesPaginationVotes(paginationChunks.length);
      setIndexPaginationVotesPerId(paginationChunks);
      if (list.length > 0) await fetchVotesPage(0, paginationChunks[0], paginationChunks.length);
      setIsListVotersSuccess(true);
      setIsListVotersError(null);
      setIsListVotersLoading(false);
    } catch (e) {
      handleError(e, "There was an error while fetching the votes");
      setIsListVotersError(error);
      setIsListVotersSuccess(false);
      setIsListVotersLoading(false);
    }
  }

  /**
   * Fetch the data of each vote in page Xz
   * @param pageIndex - index of the page of votes to fetch
   * @param slice - Array of the addresses that have cast a vote for a given proposal
   * @param totalPagesPaginationVotes - total of pages in the pagination
   */
  async function fetchVotesPage(pageIndex: number, slice: Array<any>, totalPagesPaginationVotes: number) {
    setCurrentPagePaginationVotes(pageIndex);
    setIsPageVotesLoading(true);
    setIsPageVotesError("");
    try {
      await Promise.all(
        slice.map(async (userAddress: string) => {
          await fetchVotesOfAddress(userAddress);
        }),
      );
      setIsPageVotesLoading(false);
      setIsPageVotesError("");
      setHasPaginationVotesNextPage(pageIndex + 1 < totalPagesPaginationVotes);
    } catch (e) {
      handleError(e, "There was an error while fetching the votes");
      setIsPageVotesLoading(false);
      setIsPageVotesError(error);
    }
  }

  /**
   * Fetch the data of a votes for a given wallet
   * @param userAddress - wallet address
   */
  async function fetchVotesOfAddress(userAddress: string) {
    try {
      const { abi } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        const errorMessage = "This contract doesn't exist on this chain.";
        toastError(errorMessage);
        setIsPageVotesError(errorMessage);
        setIsPageVotesLoading(false);
        return;
      }

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi as unknown as Abi,
        chainId,
      };

      const votesRaw = (await readContract({
        ...contractConfig,
        functionName: "proposalAddressVotes",
        args: [id, userAddress],
        chainId,
      })) as any;

      const forVotesBigInt = votesRaw[0];
      const againstVotesBigInt = votesRaw[1];

      const votesBigNumber = BigNumber.from(forVotesBigInt).sub(againstVotesBigInt);
      const votes = Number(utils.formatEther(votesBigNumber));

      let author;
      try {
        author = await fetchEnsName({
          address: userAddress as `0x${string}`,
          chainId: 1,
        });
      } catch (error: any) {
        author = userAddress;
      }

      const displayAddress = author ?? shortenEthereumAddress(userAddress);

      setVotesPerAddress({
        address: userAddress,
        value: { displayAddress, votes },
      });
    } catch (e) {
      handleError(e, "There was an error while fetching the votes.");
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

  // TODO: will monitor this for now, we should prolly use this event listener as well to update list live when a vote is cast, but not until i check if RPC calls are all good.
  // useEffect(() => {
  //   if (contestStatus === ContestStatus.VotingClosed) {
  //     const contract = getContract({
  //       addressOrName: asPath.split("/")[3],
  //       contractInterface: DeployedContestContract.abi,
  //     });
  //     contract.removeAllListeners();
  //   } else if (contestStatus === ContestStatus.VotingOpen) {
  //     // Only watch VoteCast events when voting is open and we are <=1h before end of voting
  //     watchContractEvent(
  //       {
  //         addressOrName: asPath.split("/")[3],
  //         contractInterface: DeployedContestContract.abi,
  //       },
  //       "VoteCast",
  //       args => {
  //         fetchVotesOfAddress(args[0]);
  //       },
  //     );
  //   }
  // }, [contestStatus]);

  useEffect(() => {
    const fetchProposalVotesAndListenForEvents = async () => {
      await fetchProposalVotes();

      const onVisibilityChangeHandler = () => {
        if (document.visibilityState === "hidden") {
          provider.removeAllListeners();
        }
      };

      document.addEventListener("visibilitychange", onVisibilityChangeHandler);

      return () => {
        document.removeEventListener("visibilitychange", onVisibilityChangeHandler);
      };
    };

    fetchProposalVotesAndListenForEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading: isListVotersLoading,
    retry: fetchProposalVotes,
    isSuccess: isListVotersSuccess,
    isError: isListVotersError,
    fetchVotesPage: fetchVotesPage,
  };
}

export default useProposalVotes;
