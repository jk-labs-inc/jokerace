import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import arrayToChunks from "@helpers/arrayToChunks";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { readContract, readContracts } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { Result } from "ethers/lib/utils";
import { shuffle } from "lodash";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";
import { ProposalCore, useProposalStore } from "./store";
import { mapResultToStringArray } from "./utils";
import isUrlToImage from "@helpers/isUrlToImage";

export const PROPOSALS_PER_PAGE = 12;

const divisor = BigInt("1000000000000000000"); // Equivalent to 1e18

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
    setTotalPagesPaginationProposals,
    setIndexPaginationProposalPerId,
    setInitialListProposalsIds,
    initialListProposalsIds,
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
   */
  async function fetchProposalsPage(pageIndex: number, slice: Array<any>, totalPagesPaginationProposals: number) {
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

      structureAndRankProposals(results, slice);
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
   *
   * @param proposalsResults (array of proposals data)
   * @param proposalIds (array of proposals ids)
   */
  function structureAndRankProposals(proposalsResults: Array<any>, proposalIds: Array<any>) {
    // step 1: transform proposals data and calculate net votes
    const transformedProposals = proposalIds.map((id, index) => {
      const voteForBigInt = proposalsResults[index * 2 + 1].result[0];
      const voteAgainstBigInt = proposalsResults[index * 2 + 1].result[1];
      const netVotesBigNumber = BigNumber.from(voteForBigInt).sub(voteAgainstBigInt);
      const netVotes = Number(utils.formatEther(netVotesBigNumber));
      const proposalData = proposalsResults[index * 2].result;
      const isContentImage = isUrlToImage(proposalData.description) ? true : false;

      return {
        id: id,
        ...proposalsResults[index * 2].result,
        isContentImage: isContentImage,
        netVotes: netVotes,
      };
    });

    // step 2: combine new proposals with existing ones and sort by net votes
    const allProposals = listProposalsData.concat(transformedProposals).sort((a, b) => b.netVotes - a.netVotes);

    // Step 3: assign ranks to proposals and identify ties
    let currentRank = 0;
    let previousVotes: number | null = null;

    allProposals.forEach((proposal, index) => {
      if (proposal.netVotes > 0) {
        if (proposal.netVotes !== previousVotes) {
          currentRank++;
          previousVotes = proposal.netVotes;
        }
        proposal.rank = currentRank;

        // Determine if the current proposal is tied with another
        proposal.isTied = allProposals.some(
          (other, otherIndex) => other.netVotes === proposal.netVotes && otherIndex !== index,
        );
      } else {
        proposal.rank = 0;
        proposal.isTied = false;
      }
    });

    setProposalData(allProposals);
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
          const forVotesValue = proposalsIdsRawData[1][index].forVotes?.toString() || "0";
          const againstVotesValue = proposalsIdsRawData[1][index].againstVotes?.toString() || "0";

          const forVotes = BigNumber.from(forVotesValue);
          const againstVotes = BigNumber.from(againstVotesValue);

          return proposalsIdsRawData[1][index].length === 1 ? forVotes : forVotes.sub(againstVotes);
        };

        const computeVotes = (index: number) => {
          const votesBigNumber = extractVotes(index);
          const votesDivided = votesBigNumber.div(BigNumber.from(divisor?.toString() || "0"));

          return parseFloat(utils.formatEther(votesDivided));
        };

        const mappedProposals = proposalsIdsRawData[0].map((data: any, index: number) => {
          return {
            votes: computeVotes(index),
            id: data,
          };
        });

        setInitialListProposalsIds(mappedProposals.map((proposal: { id: any }) => proposal.id));

        if (currentDate < contestDates.votesOpen) {
          // Shuffle proposals if current date is before votesOpen
          proposalsIds = shuffle(mappedProposals).map(proposal => proposal.id);
        } else {
          // Sort proposals by votes if current date is votesOpen or later
          proposalsIds = mappedProposals
            .sort((a: { votes: number }, b: { votes: number }) => b.votes - a.votes)
            .map((proposal: { id: any }) => proposal.id);
        }

        setListProposalsIds(proposalsIds as string[]);
        setSubmissionsCount(proposalsIds.length);
      } else {
        setInitialListProposalsIds(proposalsIdsRawData);
        if (currentDate < contestDates.votesOpen) {
          // Shuffle proposals if current date is before votesOpen
          proposalsIds = shuffle(proposalsIdsRawData);
        } else {
          proposalsIds = proposalsIdsRawData;
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
    } catch (e) {
      handleError(e, "Something went wrong while getting proposal ids.");
      setError(error);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
    }
  }

  async function getProposalIdsRaw(contractConfig: any, isLegacy: boolean) {
    if (isLegacy) {
      return (await readContract({
        ...contractConfig,
        functionName: "getAllProposalIds",
        args: [],
      })) as any;
    } else {
      const contracts = [
        {
          ...contractConfig,
          functionName: "allProposalTotalVotes",
          args: [],
        },
        {
          ...contractConfig,
          functionName: "getAllDeletedProposalIds",
          args: [],
        },
      ];

      const results: any[] = await readContracts({ contracts });

      const allProposals = results[0].result[0];
      const deletedIdsArray = results[1]?.result;

      if (!deletedIdsArray) {
        return [allProposals, results[0].result[1]];
      }

      const deletedProposalSet = new Set(mapResultToStringArray(deletedIdsArray));

      const validData = allProposals.reduce(
        (
          accumulator: { validProposalIds: any[]; correspondingVotes: any[] },
          proposalId: { toString: () => string },
          index: string | number,
        ) => {
          if (!deletedProposalSet.has(proposalId.toString())) {
            accumulator.validProposalIds.push(proposalId);
            accumulator.correspondingVotes.push(results[0].result[1][index]);
          }
          return accumulator;
        },
        { validProposalIds: [], correspondingVotes: [] },
      );

      return [validData.validProposalIds, validData.correspondingVotes];
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
   * Update a single proposal and re-sort and re-rank all proposals
   * @param updatedProposal - the updated proposal data
   */
  const updateAndRankSingleProposal = (updatedProposal: ProposalCore) => {
    const updatedProposals = listProposalsData.map(proposal =>
      proposal.id === updatedProposal.id ? updatedProposal : proposal,
    );

    // Sort the proposals by netVotes
    const sortedProposals = updatedProposals.sort((a, b) => b.netVotes - a.netVotes);

    // Assign ranks and check for ties
    let currentRank = 0;
    let previousVotes: number | null = null;

    const proposals = sortedProposals.map((proposal, index) => {
      if (proposal.netVotes > 0) {
        if (proposal.netVotes !== previousVotes) {
          currentRank++;
          previousVotes = proposal.netVotes;
        }
        proposal.rank = currentRank;
        // Determine if the current proposal is tied with another
        proposal.isTied = sortedProposals.some(
          (other, otherIndex) => other.netVotes === proposal.netVotes && otherIndex !== index,
        );
      } else {
        proposal.rank = 0;
        proposal.isTied = false;
      }
      return proposal;
    });

    setProposalData(proposals);
  };

  /**
   * Remove a list of proposals and re-sort and re-rank all proposals
   * @param idsToDelete - the list of proposals ids to remove
   */
  const removeAndRankProposals = (idsToDelete: string[]) => {
    const remainingProposals = listProposalsData.filter(proposal => !idsToDelete.includes(proposal.id));

    const sortedProposals = remainingProposals.sort((a, b) => b.netVotes - a.netVotes);

    let currentRank = 0;
    let previousVotes: number | null = null;

    const reRankedProposals = sortedProposals.map((proposal, index) => {
      if (proposal.netVotes > 0) {
        if (proposal.netVotes !== previousVotes) {
          currentRank++;
          previousVotes = proposal.netVotes;
        }
        proposal.rank = currentRank;
        proposal.isTied = sortedProposals.some(
          (other, otherIndex) => other.netVotes === proposal.netVotes && otherIndex !== index,
        );
      } else {
        proposal.rank = 0;
        proposal.isTied = false;
      }
      return proposal;
    });

    setProposalData(reRankedProposals);
  };

  return {
    fetchProposalsPage,
    fetchSingleProposal,
    fetchProposalsIdsList,
    updateAndRankSingleProposal,
    removeAndRankProposals,
  };
}

export default useProposal;
