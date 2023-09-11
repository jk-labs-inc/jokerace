import { toastError } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import arrayToChunks from "@helpers/arrayToChunks";
import getContestContractVersion from "@helpers/getContestContractVersion";
import isUrlToImage from "@helpers/isUrlToImage";
import { useContestStore } from "@hooks/useContest/store";
import { readContract, readContracts } from "@wagmi/core";
import { BigNumber, utils } from "ethers";

import { Result } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { CustomError } from "types/error";
import { useNetwork } from "wagmi";
import { useProposalStore } from "./store";

const PROPOSALS_PER_PAGE = 12;

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
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2])?.[0]?.id;

  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
    toastError(toastMessage);
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
    setIsPageProposalsError(null);

    try {
      const { abi } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        const errorMsg = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
        toastError(errorMsg);
        setIsPageProposalsError({ message: errorMsg });
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
      setIsPageProposalsError(null);
      setHasPaginationProposalsNextPage(pageIndex + 1 < totalPagesPaginationProposals);
    } catch (e) {
      const customError = e as CustomError;

      if (!customError) return;

      toastError("Something went wrong while getting proposals.", customError.message);
      setIsPageProposalsError({
        code: customError.code,
        message: customError.message,
      });
      setIsPageProposalsLoading(false);
      setIsPageProposalsError(null);
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

    const forVotesBigInt = proposalDataPerId[i][1].result[0] as bigint;
    const againstVotesBigInt = proposalDataPerId[i][1].result[1] as bigint;
    const votesBigNumber = BigNumber.from(forVotesBigInt).sub(againstVotesBigInt);
    const votes = Number(utils.formatEther(votesBigNumber));

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

      const proposalsIdsRawData = (await readContract({
        ...contractConfig,
        functionName: !useLegacyGetAllProposalsIdFn ? "allProposalTotalVotes" : "getAllProposalIds",
        args: [],
      })) as any;

      let proposalsIds: Result;
      if (!useLegacyGetAllProposalsIdFn) {
        proposalsIds = [];
        proposalsIdsRawData[0].map((data: any, index: number) => {
          const forVotesBigNumber = BigNumber.from(proposalsIdsRawData[1][index].forVotes.toString());
          const againstVotesBigNumber = BigNumber.from(
            proposalsIdsRawData[1][index].againstVotes ? proposalsIdsRawData[1][index].againstVotes.toString() : "0",
          );
          const votesBigNumber =
            proposalsIdsRawData[1][index].length === 1
              ? forVotesBigNumber
              : forVotesBigNumber.sub(againstVotesBigNumber);
          const votesDivided = votesBigNumber.div(BigNumber.from(divisor.toString()));
          const votes = parseFloat(utils.formatEther(votesDivided));

          proposalsIds.push({
            votes,
            id: data,
          });
        });
        proposalsIds = proposalsIds
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
      const customError = e as CustomError;

      if (!customError) return;

      onContractError(e);
      setError(customError);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
    }
  }

  return {
    fetchProposal,
    fetchProposalsPage,
    fetchProposalsIdsList,
  };
}

export default useProposal;
