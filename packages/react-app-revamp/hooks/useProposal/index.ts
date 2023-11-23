import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import arrayToChunks from "@helpers/arrayToChunks";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { readContracts } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { Result } from "ethers/lib/utils";
import { shuffle, sortBy as sortUnique } from "lodash";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";
import { ProposalCore, SortOptions, useProposalStore } from "./store";
import {
  formatProposalData,
  getProposalIdsRaw,
  sortProposals,
  transformProposalData,
  updateAndRankProposals,
} from "./utils";

export const PROPOSALS_PER_PAGE = 12;

export function useProposal() {
  const {
    setCurrentPagePaginationProposals,
    setIsPageProposalsLoading,
    setIsPageProposalsError,
    setHasPaginationProposalsNextPage,
    setProposalData,
    setIsListProposalsLoading,
    setIsListProposalsSuccess,
    listProposalsData,
    setListProposalsIds,
    setSubmissionsCount,
    submissionsCount,
    setTotalPagesPaginationProposals,
    setIndexPaginationProposalPerId,
    setInitialMappedProposalIds,
    setSortBy,
    initialMappedProposalIds,
  } = useProposalStore(state => state);
  const { asPath } = useRouter();
  const { chainName, address } = extractPathSegments(asPath);
  const { setIsLoading, setIsSuccess, setError } = useContestStore(state => state);
  const { chain } = useNetwork();
  const { error, handleError } = useError();
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;

  async function getContractConfig() {
    const { abi } = await getContestContractVersion(address, chainId);

    if (abi === null) {
      const errorMsg = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
      toastError(errorMsg);
      setIsPageProposalsError(errorMsg);
      return;
    }

    return {
      address: address as `0x${string}`,
      abi: abi,
      chainId: chainId,
    };
  }

  /**
   * Fetch the data of each proposals in page X
   * @param pageIndex - index of the page of proposals to fetch
   * @param slice - Array of proposals ids to be fetched
   * @param totalPagesPaginationProposals - total of pages in the pagination
   * @param sorting - boolean to know if we need to sort the proposals
   */
  async function fetchProposalsPage(
    pageIndex: number,
    slice: Array<any>,
    totalPagesPaginationProposals: number,
    sorting?: boolean,
  ) {
    setCurrentPagePaginationProposals(pageIndex);
    setIsPageProposalsLoading(true);
    setIsPageProposalsError("");

    try {
      const contractConfig = await getContractConfig();

      const contracts: any[] = [];

      for (const id of slice) {
        contracts.push(
          {
            ...contractConfig,
            functionName: "getProposal",
            args: [id],
          },
          {
            ...contractConfig,
            functionName: "proposalVotes",
            args: [id],
          },
        );
      }

      const results = await readContracts({ contracts });

      structureAndRankProposals(results, slice, sorting);

      setIsPageProposalsLoading(false);
      setIsPageProposalsError("");
      setHasPaginationProposalsNextPage(pageIndex + 1 < totalPagesPaginationProposals);
    } catch (e) {
      handleError(e, "Something went wrong while getting proposals.");
      setIsPageProposalsError(error);
      setIsPageProposalsLoading(false);
    }
  }
  /**
   * Fetch the list of proposals ids for this contest, order them by votes and set up pagination
   * @param abi - ABI to use
   */
  async function fetchProposalsIdsList(abi: any, contestDates: { submissionOpen: Date; votesOpen: Date }) {
    setIsListProposalsLoading(true);

    try {
      const useLegacyGetAllProposalsIdFn =
        abi?.filter((el: { name: string }) => el.name === "allProposalTotalVotes")?.length > 0 ? false : true;

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId,
      };

      const proposalsIdsRawData = await getProposalIdsRaw(contractConfig, useLegacyGetAllProposalsIdFn);

      let proposalsIds: Result;
      const currentDate = new Date();

      if (!useLegacyGetAllProposalsIdFn) {
        const extractVotes = (index: number) => {
          const forVotesValue = proposalsIdsRawData[1][index].forVotes;
          const againstVotesValue = proposalsIdsRawData[1][index].againstVotes;

          const netVotesBigNumber = BigNumber.from(forVotesValue).sub(againstVotesValue);
          const netVotes = Number(utils.formatEther(netVotesBigNumber));

          return netVotes;
        };

        const mappedProposals = proposalsIdsRawData[0].map((data: any, index: number) => {
          const votes = extractVotes(index);
          return {
            votes: votes,
            id: data,
          };
        });

        setInitialMappedProposalIds(mappedProposals);

        if (currentDate < contestDates.votesOpen) {
          // Shuffle proposals if current date is before votesOpen
          proposalsIds = shuffle([...mappedProposals]).map(proposal => proposal.id);
          setSortBy("random");
        } else {
          proposalsIds = [...mappedProposals]
            .sort((a: { votes: number }, b: { votes: number }) => b.votes - a.votes)
            .map((proposal: { id: any }) => proposal.id);
          setSortBy("votes");
        }

        setListProposalsIds(proposalsIds as string[]);
        setSubmissionsCount(proposalsIds.length);
      } else {
        if (currentDate < contestDates.votesOpen) {
          // Shuffle proposals if current date is before votesOpen
          proposalsIds = shuffle(proposalsIdsRawData);
          setSortBy("random");
        } else {
          proposalsIds = proposalsIdsRawData;
          setSortBy("votes");
        }
        setListProposalsIds(proposalsIds as string[]);
        setSubmissionsCount(proposalsIds.length);
      }
      setIsListProposalsSuccess(true);
      setIsListProposalsLoading(false);

      // Pagination
      const totalPagesPaginationProposals = Math.ceil(proposalsIdsRawData?.length / PROPOSALS_PER_PAGE);
      setTotalPagesPaginationProposals(totalPagesPaginationProposals);
      setCurrentPagePaginationProposals(0);

      const paginationChunks = arrayToChunks(proposalsIds as string[], PROPOSALS_PER_PAGE);
      setTotalPagesPaginationProposals(paginationChunks.length);
      setIndexPaginationProposalPerId(paginationChunks);

      fetchProposalsPage(0, paginationChunks[0], paginationChunks.length);
    } catch (e) {
      handleError(e, "Something went wrong while getting proposal ids.");
      setError(error);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
    }
  }

  /**
   * Fetch a single proposal based on its ID.
   * @param proposalId - the ID of the proposal to fetch
   */
  async function fetchSingleProposal(proposalId: any) {
    try {
      const contractConfig = await getContractConfig();

      const contracts = [
        {
          ...contractConfig,
          functionName: "getProposal",
          args: [proposalId],
        },
        {
          ...contractConfig,
          functionName: "proposalVotes",
          args: [proposalId],
        },
      ];

      //@ts-ignore
      const results = await readContracts({ contracts });

      structureAndRankProposals(results, [proposalId]);
    } catch (e) {
      handleError(e, "Something went wrong while getting the proposal.");
      setIsPageProposalsError(error);
    }
  }

  /**
   * @param proposalsResults (array of proposals data)
   * @param proposalIds (array of proposals ids)
   * @param sorting (optional boolean to skip concatenation if true)
   */
  function structureAndRankProposals(proposalsResults: Array<any>, proposalIds: Array<any>, sorting?: boolean) {
    // Transform proposals data and calculate net votes
    const transformedProposals = proposalIds.map((id, index) =>
      transformProposalData(id, proposalsResults[index * 2 + 1], proposalsResults[index * 2].result),
    );

    let combinedProposals;

    // Concatenate only if sorting is false
    if (!sorting) {
      combinedProposals = listProposalsData.concat(transformedProposals);
    } else {
      combinedProposals = transformedProposals;
    }

    const rankedProposals = formatProposalData(combinedProposals, initialMappedProposalIds);

    setProposalData(rankedProposals);
  }

  function updateProposal(updatedProposal: ProposalCore) {
    const updatedProposals = listProposalsData.map(proposal =>
      proposal.id === updatedProposal.id ? updatedProposal : proposal,
    );

    const [updatedProposalData, updatedIds] = updateAndRankProposals(updatedProposals, initialMappedProposalIds);

    setProposalData(updatedProposalData);
    setInitialMappedProposalIds(updatedIds);
  }

  function removeProposal(idsToDelete: string[]) {
    const remainingProposals = listProposalsData.filter(proposal => !idsToDelete.includes(proposal.id));

    const [updatedProposalData, updatedIds] = updateAndRankProposals(remainingProposals, initialMappedProposalIds);

    setProposalData(updatedProposalData);
    setInitialMappedProposalIds(updatedIds);
    setSubmissionsCount(submissionsCount - idsToDelete.length);
  }

  /**
   * Sort proposals by a given sorting option
   * @param sortBy - the sorting option to use
   */
  function sortProposalData(sortBy: SortOptions) {
    const sortedIds = sortProposals(sortBy, initialMappedProposalIds);

    if (listProposalsData.length === sortedIds.length) {
      const sortedProposals = sortUnique(listProposalsData, v => sortedIds.indexOf(v.id));
      setProposalData(sortedProposals);
    } else {
      const paginationChunks = arrayToChunks(sortedIds, PROPOSALS_PER_PAGE);
      setIndexPaginationProposalPerId(paginationChunks);
      setProposalData([]);

      fetchProposalsPage(0, paginationChunks[0], paginationChunks.length, true);
    }
  }

  return {
    fetchProposalsPage,
    fetchSingleProposal,
    fetchProposalsIdsList,
    updateProposal,
    removeProposal,
    sortProposalData,
  };
}

export default useProposal;
