import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import arrayToChunks from "@helpers/arrayToChunks";
import getContestContractVersion from "@helpers/getContestContractVersion";
import isUrlToImage from "@helpers/isUrlToImage";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { readContract, readContracts } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { Result } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useNetwork } from "wagmi";
import { useProposalStore } from "./store";

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
    setListProposalsIds,
    setTotalPagesPaginationProposals,
    setIndexPaginationProposalPerId,
  } = useProposalStore(state => state);
  const { asPath } = useRouter();
  const [chainName, address] = asPath.split("/").slice(2, 4);
  const { setIsLoading, setIsSuccess, setError } = useContestStore(state => state);
  const { chain } = useNetwork();
  const { error, handleError } = useError();
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id;

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
      const { abi } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        const errorMsg = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
        toastError(errorMsg);
        setIsPageProposalsError(errorMsg);
        setIsPageProposalsLoading(false);
        return;
      }

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chains.find(
          c => c.name.replace(/\s+/g, "").toLowerCase() === chainName.replace(/\s+/g, "").toLowerCase(),
        )?.id,
      };

      const contracts: any[] = [];

      for (const id of slice) {
        contracts.push(
          // Proposal content
          {
            ...contractConfig,
            functionName: "getProposal",
            args: [id],
          },
          // Votes received
          {
            ...contractConfig,
            functionName: "proposalVotes",
            args: [id],
          },
        );
      }

      const results = await readContracts({ contracts });

      for (let i = 0; i < slice.length; i++) {
        await fetchProposal(i, results, slice);
      }

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
   * Set proposal data in zustand store
   * @param i - index of the proposal id to be fetched
   * @param results - array of smart contracts calls results (returned by `readContracts`)
   * @param listIdsProposalsToBeFetched - array of proposals ids to be fetched
   */
  async function fetchProposal(i: number, results: Array<any>, listIdsProposalsToBeFetched: Array<any>) {
    // Create an array of proposals
    // A proposal is a pair of data
    // A pair of a proposal data is [content, votes]
    const proposalDataPerId = results.reduce((result, value, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, []);

    const data = proposalDataPerId[i][0].result;

    const isContentImage = isUrlToImage(data.description) ? true : false;

    let forVotesBigInt: bigint;
    let againstVotesBigInt: bigint;
    let votes: number;

    if (Array.isArray(proposalDataPerId[i][1].result)) {
      forVotesBigInt = proposalDataPerId[i][1].result[0] as bigint;
      againstVotesBigInt = proposalDataPerId[i][1].result[1] as bigint;
      const votesBigNumber = BigNumber.from(forVotesBigInt).sub(againstVotesBigInt);
      votes = Number(utils.formatEther(votesBigNumber));
    } else {
      votes = Number(utils.formatEther(proposalDataPerId[i][1].result as bigint));
    }

    const proposalData = {
      authorEthereumAddress: data.author,
      content: data.description,
      isContentImage,
      exists: data.exists,
      votes,
    };

    setProposalData({ id: listIdsProposalsToBeFetched[i], data: proposalData });
  }

  /**
   * Fetch the list of proposals ids for this contest, order them by votes and set up pagination
   * @param abi - ABI to use
   */
  async function fetchProposalsIdsList(abi: any) {
    setIsListProposalsLoading(true);

    try {
      // Get list of proposals (ids)
      const useLegacyGetAllProposalsIdFn =
        abi?.filter((el: { name: string }) => el.name === "allProposalTotalVotes")?.length > 0 ? false : true;

      if (!chains) return;

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chains.find(
          c => c.name.replace(/\s+/g, "").toLowerCase() === chainName.replace(/\s+/g, "").toLowerCase(),
        )?.id,
      };

      const proposalsIdsRawData = await getProposalIdsRaw(contractConfig, useLegacyGetAllProposalsIdFn);

      let proposalsIds: Result;
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

        proposalsIds = mappedProposals
          .sort((a: { votes: number }, b: { votes: number }) => b.votes - a.votes)
          .map((proposal: { id: any }) => proposal.id);

        setListProposalsIds(proposalsIds as string[]);
      } else {
        proposalsIds = proposalsIdsRawData;
        setListProposalsIds(proposalsIds as string[]);
      }
      setIsListProposalsSuccess(true);
      setIsListProposalsLoading(false);

      // Pagination
      const totalPagesPaginationProposals = Math.ceil(proposalsIdsRawData?.length / PROPOSALS_PER_PAGE);
      setTotalPagesPaginationProposals(totalPagesPaginationProposals);
      setCurrentPagePaginationProposals(0);
      //@ts-ignore
      const paginationChunks = arrayToChunks(proposalsIds, PROPOSALS_PER_PAGE);
      setTotalPagesPaginationProposals(paginationChunks.length);
      setIndexPaginationProposalPerId(paginationChunks);

      if (proposalsIds.length > 0) await fetchProposalsPage(0, paginationChunks[0], paginationChunks.length);
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

  const mapResultToStringArray = (result: any): string[] => {
    if (Array.isArray(result)) {
      return result.map((id: bigint) => id.toString());
    } else {
      return [result.toString()];
    }
  };

  return {
    fetchProposal,
    fetchProposalsPage,
    fetchProposalsIdsList,
  };
}

export default useProposal;
