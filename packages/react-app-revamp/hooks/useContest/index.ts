import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useProvider } from "wagmi";
import { fetchBlockNumber, fetchToken, getAccount, readContract, readContracts } from "@wagmi/core";
import { chains } from "@config/wagmi";
import isUrlToImage from "@helpers/isUrlToImage";
import { useStore } from "./store";
import { differenceInHours, differenceInMilliseconds, hoursToMilliseconds, isBefore, isFuture } from "date-fns";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import getContestContractVersion from "@helpers/getContestContractVersion";
import useContestsIndex from "@hooks/useContestsIndex";
import useContestProposalsIndex from "@hooks/useContestProposalsIndex";
import arrayToChunks from "@helpers/arrayToChunks";
import { useQueries } from "@tanstack/react-query";

const PROPOSALS_PER_PAGE = 12;

export function useContest() {
  const { indexContest } = useContestsIndex();
  const { indexProposal } = useContestProposalsIndex();

  const provider = useProvider();
  const { asPath } = useRouter();
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")[2])?.[0]?.id,
  );
  const [address, setAddress] = useState(asPath.split("/")[3]);
  const [chainName, setChainName] = useState(asPath.split("/")[2]);
  const [sliceOfProposalsIdsToFetch, setSliceOfProposalsIdsToFetch] = useState([]);
  const {
    //@ts-ignore
    listProposalsData,
    //@ts-ignore
    isPageProposalsLoading,
    //@ts-ignore
    setCurrentUserSubmitProposalTokensAmount,
    //@ts-ignore
    setContestName,
    //@ts-ignore
    setProposalData,
    //@ts-ignore
    setContestAuthor,
    //@ts-ignore
    setAmountOfTokensRequiredToSubmitEntry,
    //@ts-ignore
    setSubmissionsOpen,
    //@ts-ignore
    setContestStatus,
    //@ts-ignore
    setVotingTokenAddress,
    //@ts-ignore
    setVotingToken,
    //@ts-ignore
    setVotesOpen,
    //@ts-ignore
    setCurrentUserAvailableVotesAmount,
    //@ts-ignore
    setListProposalsIds,
    //@ts-ignore
    setIsError,
    //@ts-ignore
    setIsLoading,
    //@ts-ignore
    setIsListProposalsLoading,
    //@ts-ignore
    setVotesClose,
    //@ts-ignore
    isLoading,
    //@ts-ignore
    isListProposalsLoading,
    //@ts-ignore
    isError,
    //@ts-ignore
    isListProposalsError,
    //@ts-ignore
    isSuccess,
    //@ts-ignore
    setIsSuccess,
    //@ts-ignore
    isListProposalsSuccess,
    //@ts-ignore
    setIsListProposalsSuccess,
    //@ts-ignore
    resetListProposals,
    //@ts-ignore
    setCurrentUserTotalVotesCast,
    //@ts-ignore
    setContestMaxNumberSubmissionsPerUser,
    //@ts-ignore
    setContestMaxProposalCount,
    //@ts-ignore
    increaseCurrentUserProposalCount,
    //@ts-ignore
    setUsersQualifyToVoteIfTheyHoldTokenAtTime,
    //@ts-ignore
    setDidUserPassSnapshotAndCanVote,
    //@ts-ignore
    setSnapshotTaken,
    //@ts-ignore
    setCheckIfUserPassedSnapshotLoading,
    //@ts-ignore
    setContestPrompt,
    //@ts-ignore
    setDownvotingAllowed,
    //@ts-ignore
    setSubmitProposalTokenAddress,
    //@ts-ignore
    setSubmitProposalToken,
    //@ts-ignore
    setIndexPaginationProposalPerId,
    //@ts-ignore
    setTotalPagesPaginationProposals,
    //@ts-ignore
    setCurrentPagePaginationProposals,
    //@ts-ignore
    setIsPageProposalsLoading,
    //@ts-ignore
    setIsPageProposalsError,
    //@ts-ignore
    setHasPaginationProposalsNextPage,
    //@ts-ignore
    setCanUpdateVotesInRealTime,
  } = useStore();

  /**
   * Load proposals based on a Array of proposals ids
   */
  const queryProposals = useQueries({
    queries: sliceOfProposalsIdsToFetch?.map((id: string) => {
      return {
        queryKey: ["proposal", id.toString()],
        queryFn: async () => {
          try {
            const abi = await getContestContractVersion(address, chainName);
            if (abi === null) {
              toast.error("This contract doesn't exist on this chain.");
              setIsPageProposalsError("This contract doesn't exist on this chain.");
              setIsPageProposalsLoading(false);
              return;
            }
            const contractConfig = {
              addressOrName: address,
              contractInterface: abi,
              chainId: chainId,
            };
            const contracts: any = [
              // Votes received
              {
                ...contractConfig,
                functionName: "proposalVotes",
                args: id.toString(),
              },
            ];
            let existsInDb = false;
            let shouldAddToDb = false;
            let proposalData;
            let results;
            try {
              if (
                process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
                process.env.NEXT_PUBLIC_SUPABASE_URL &&
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ) {
                const config = await import("@config/supabase");
                const supabase = config.supabase;

                const result = await supabase
                  .from("proposals")
                  .select("author_address, content, is_content_image")
                  .eq("reference", id.toString())
                  .eq("contest_address", address)
                  .eq("contest_network_name", chainName);

                const { data, error } = result;

                // If the proposal doesn't exist in the DB (or couldn't be found)
                // fetch it from the blockchain

                if (data?.length === 0 || error) {
                  if (error) console.error(error);
                  contracts.push({
                    ...contractConfig,
                    functionName: "getProposal",
                    args: id.toString(),
                  });
                }
                //@ts-ignore
                existsInDb = data?.length > 0 ?? false;
                shouldAddToDb = data?.length === 0;
                results = await readContracts({ contracts });
                existsInDb ? [data?.[0]?.author_address, data?.[0]?.content] : results[1];
              } else {
                existsInDb = false;
                contracts.push({
                  ...contractConfig,
                  functionName: "getProposal",
                  args: id.toString(),
                });
                results = await readContracts({ contracts });
                proposalData = results[1];
              }
              fetchProposal(id.toString(), proposalData, results[0], existsInDb, shouldAddToDb);
            } catch (e) {
              console.error(e);
              setIsPageProposalsLoading(false);
              //@ts-ignore
              setIsPageProposalsError(e?.message ?? e);
            }
          } catch (e) {
            console.error(e);
          }
        },
      };
    }),
  });

  /**
   * Display an error toast in the UI for any contract related error
   */
  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = "This contract doesn't exist on this chain.";
    toast.error(toastMessage);
  }

  /**
   * Fetch all info of a contest (title, prompt, list of proposals etc.)
   */
  async function fetchContestInfo() {
    setIsLoading(true);
    const abi = await getContestContractVersion(address, chainName);
    if (abi === null) {
      toast.error("This contract doesn't exist on this chain.");
      setIsError("This contract doesn't exist on this chain.");
      setIsSuccess(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      return;
    }
    const accountData = await getAccount();
    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
      chainId: chainId,
    };
    try {
      const contracts = [
        // Contest name
        {
          ...contractConfig,
          functionName: "name",
        },
        // Contest creator address
        {
          ...contractConfig,
          functionName: "creator",
        },
        // Maximum submissions *per user* for the contest
        {
          ...contractConfig,
          functionName: "numAllowedProposalSubmissions",
        },
        // Maximum amout of proposals for the contest
        {
          ...contractConfig,
          functionName: "maxProposalCount",
        },
        // Voting token address
        {
          ...contractConfig,
          functionName: "token",
        },
        // Timestamp when contest start (submissions open)
        {
          ...contractConfig,
          functionName: "contestStart",
        },
        // Timestamp when contest ends (voting closes)
        {
          ...contractConfig,
          functionName: "contestDeadline",
        },
        // Timestamp when votes open
        {
          ...contractConfig,
          functionName: "voteStart",
        },
        // Contest status
        {
          ...contractConfig,
          functionName: "state",
        },
        // Amount of token required for a user to vote
        {
          ...contractConfig,
          functionName: "proposalThreshold",
        },
      ];
      if (abi?.filter(el => el.name === "prompt").length > 0) {
        contracts.push({
          ...contractConfig,
          functionName: "prompt",
        });
      }
      if (abi?.filter(el => el.name === "downvotingAllowed").length > 0) {
        contracts.push({
          ...contractConfig,
          functionName: "downvotingAllowed",
        });
      }
      if (abi?.filter(el => el.name === "submissionGatingByVotingToken").length > 0) {
        contracts.push({
          ...contractConfig,
          functionName: "submissionGatingByVotingToken",
        });
        contracts.push({
          ...contractConfig,
          functionName: "submissionToken",
        });
      }

      const results = await readContracts({ contracts });
      if (abi?.filter(el => el.name === "prompt").length > 0) {
        //@ts-ignore
        const indexToCheck =
          abi?.filter(el => el.name === "submissionGatingByVotingToken").length > 0
            ? 4
            : abi?.filter(el => el.name === "downvotingAllowed").length > 0
            ? 2
            : 1;
        setContestPrompt(results[contracts.length - indexToCheck]);
      }
      if (abi?.filter(el => el.name === "downvotingAllowed").length > 0) {
        const isAllowed =
          parseInt(
            `${
              results[
                abi?.filter(el => el.name === "submissionGatingByVotingToken").length > 0
                  ? contracts.length - 3
                  : contracts.length - 1
              ]
            }`,
          ) === 1
            ? true
            : false;
        setDownvotingAllowed(isAllowed);
      } else {
        setDownvotingAllowed(false);
      }

      setContestName(results[0]);
      setContestAuthor(results[1]);
      setContestMaxNumberSubmissionsPerUser(results[2]);
      setContestMaxProposalCount(results[3]);
      setVotingTokenAddress(results[4]);
      // Voting token data (balance, symbol, total supply etc) (for ERC-20 token)
      //@ts-ignore
      const votingTokenRawData = await fetchToken({ address: results[4], chainId });
      //@ts-ignore
      const closingVoteDate = new Date(parseInt(results[6]) * 1000);
      setVotingToken(votingTokenRawData);
      //@ts-ignore
      setSubmissionsOpen(new Date(parseInt(results[5]) * 1000));
      setVotesClose(closingVoteDate);
      //@ts-ignore
      setVotesOpen(new Date(parseInt(results[7]) * 1000));
      // We want to track VoteCast event only 1H before the end of the contest
      if (isBefore(new Date(), closingVoteDate)) {
        if (differenceInHours(closingVoteDate, new Date()) <= 1) {
          // If the difference between the closing date (end of votes) and now is <= to 1h
          // reflect this in the state
          setCanUpdateVotesInRealTime(true);
        } else {
          setCanUpdateVotesInRealTime(false);
          // Otherwise, update the state 1h before the closing date (end of votes)
          const delayBeforeVotesCanBeUpdated =
            differenceInMilliseconds(closingVoteDate, new Date()) - hoursToMilliseconds(1);
          setTimeout(() => {
            setCanUpdateVotesInRealTime(true);
          }, delayBeforeVotesCanBeUpdated);
        }
      } else {
        setCanUpdateVotesInRealTime(false);
      }

      if (
        //@ts-ignore
        results[8] === CONTEST_STATUS.SUBMISSIONS_OPEN &&
        //@ts-ignore
        isBefore(new Date(), new Date(parseInt(results[5]) * 1000))
      ) {
        // If the contest status is marked as open
        // but the current date is before the opening of submissions
        // Then we use a special status on the frontend
        // This way we can display a countdown until submissions open
        setContestStatus(CONTEST_STATUS.SUBMISSIONS_NOT_OPEN);
      } else {
        setContestStatus(results[8]);
      }
      //@ts-ignore
      setAmountOfTokensRequiredToSubmitEntry(results[9] / 1e18);

      if (abi?.filter(el => el.name === "submissionGatingByVotingToken").length > 0) {
        //@ts-ignore
        const submitProposalTokenRawData = await fetchToken({ address: results[contracts.length - 1], chainId });
        setSubmitProposalTokenAddress(results[contracts.length - 1]);
        setSubmitProposalToken(submitProposalTokenRawData);
        if (accountData?.address) await checkCurrentUserAmountOfProposalTokens();
      } else {
        setSubmitProposalTokenAddress(results[4]);
        setSubmitProposalToken(votingTokenRawData);
      }
      await checkIfCurrentUserQualifyToVote();
      if (accountData?.address) {
        // Current user votes
        await updateCurrentUserVotes();
      }
      // If current page is proposal, fetch proposal with id
      if (asPath.includes("/proposal/")) {
        await fetchProposalsPage(0, [asPath.split("/")[5]], 1);
        fetchProposalsIdsList(abi);
      } else {
        // otherwise, fetch proposals
        // List of proposals for this contest
        await fetchProposalsIdsList(abi);
      }
      setIsListProposalsLoading(false);
      setIsError(null);
      setIsSuccess(true);
      setIsLoading(false);
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "" &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        const config = await import("@config/supabase");
        const supabase = config.supabase;
        const indexingResult = await supabase
          .from("contests")
          .select("*")
          .eq("address", address)
          .eq("network_name", asPath.split("/")[2]);
        if (indexingResult && indexingResult?.data && indexingResult?.data?.length === 0) {
          indexContest({
            //@ts-ignore
            datetimeOpeningSubmissions: new Date(parseInt(results[5]) * 1000).toISOString(),
            //@ts-ignore
            datetimeOpeningVoting: new Date(parseInt(results[7]) * 1000).toISOString(),
            //@ts-ignore
            datetimeClosingVoting: new Date(parseInt(results[6]) * 1000),
            contestTitle: results[0],
            daoName: null,
            contractAddress: address,
            authorAddress: results[1],
            votingTokenAddress: results[4],
            networkName: asPath.split("/")[2],
          });
        }
      }
    } catch (e) {
      onContractError(e);
      //@ts-ignore
      setIsError(e?.code ?? e);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      console.error(e);
    }
  }

  /**
   * Check how many proposal tokens of this contest the current user holds
   */
  async function checkCurrentUserAmountOfProposalTokens() {
    const abi = await getContestContractVersion(address, chainName);
    if (abi === null) {
      toast.error("This contract doesn't exist on this chain.");
      setIsError("This contract doesn't exist on this chain.");
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsLoading(false);
      return;
    }

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
      chainId,
    };
    const contractBaseOptions = {};
    try {
      const accountData = await getAccount();
      const amount = await readContract({
        ...contractConfig,
        ...contractBaseOptions,
        functionName: "getCurrentSubmissionTokenVotes",
        //@ts-ignore
        args: [accountData?.address],
      });
      //@ts-ignore
      setCurrentUserSubmitProposalTokensAmount(amount / 1e18);
    } catch (e) {
      onContractError(e);
      //@ts-ignore
      setIsError(e?.code ?? e);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      console.error(e);
    }
  }

  /**
   * Check if the current user qualify to vote for this contest
   */
  async function checkIfCurrentUserQualifyToVote() {
    const abi = await getContestContractVersion(address, chainName);
    if (abi === null) {
      toast.error("This contract doesn't exist on this chain.");
      setIsError("This contract doesn't exist on this chain.");
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsLoading(false);
      return;
    }

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
      chainId: chainId,
    };
    setCheckIfUserPassedSnapshotLoading(true);

    try {
      const accountData = await getAccount();

      // Timestamp from when a user can vote
      // depending on the amount of voting token they're holding at a given timestamp (snapshot)
      const timestampSnapshotRawData = await readContract({
        ...contractConfig,
        functionName: "contestSnapshot",
      });

      //@ts-ignore
      setUsersQualifyToVoteIfTheyHoldTokenAtTime(new Date(parseInt(timestampSnapshotRawData) * 1000));
      //@ts-ignore
      if (!isFuture(new Date(parseInt(timestampSnapshotRawData) * 1000))) {
        setSnapshotTaken(true);
        const delayedCurrentTimestamp = Date.now() - 59; // Delay by 59 seconds to make sure we're looking at a block that has been mined

        const timestampToCheck =
          //@ts-ignore
          delayedCurrentTimestamp >= timestampSnapshotRawData ? timestampSnapshotRawData : delayedCurrentTimestamp;
        if (accountData?.address) {
          const tokenUserWasHoldingAtSnapshotRawData = await readContract({
            ...contractConfig,
            functionName: "getVotes",
            //@ts-ignore
            args: [accountData?.address, timestampToCheck],
          });
          //@ts-ignore
          setDidUserPassSnapshotAndCanVote(tokenUserWasHoldingAtSnapshotRawData / 1e18 > 0);
        } else {
          setDidUserPassSnapshotAndCanVote(false);
        }
      } else {
        setSnapshotTaken(false);
      }

      setCheckIfUserPassedSnapshotLoading(false);
    } catch (e) {
      console.error(e);
      setCheckIfUserPassedSnapshotLoading(false);
    }
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
        //@ts-ignore
        abi?.filter(el => el.name === "allProposalTotalVotes")?.length > 0 ? false : true;
      const contractConfig = {
        addressOrName: address,
        contractInterface: abi,
        chainId: chainId,
      };
      const proposalsIdsRawData = await readContract({
        ...contractConfig,
        functionName: !useLegacyGetAllProposalsIdFn ? "allProposalTotalVotes" : "getAllProposalIds",
      });
      //@ts-ignore
      let proposalsIds;
      if (!useLegacyGetAllProposalsIdFn) {
        //@ts-ignore
        proposalsIds = [];
        proposalsIdsRawData[0].map((data: any, index: number) => {
          proposalsIds.push({
            // for votes minus against votes if there are against votes
            votes:
              proposalsIdsRawData[1][index].length == 1
                ? proposalsIdsRawData[1][index][0] / 1e18
                : proposalsIdsRawData[1][index][0] / 1e18 - proposalsIdsRawData[1][index][1] / 1e18,
            id: data,
          });
        });
        //@ts-ignore
        proposalsIds = proposalsIds
          .sort((a, b) => {
            if (a.votes > b.votes) {
              return -1;
            }
            if (a.votes < b.votes) {
              return 1;
            }
            return 0;
          })
          //@ts-ignore
          .map(proposal => proposal.id);
        setListProposalsIds(proposalsIds);
      } else {
        proposalsIds = proposalsIdsRawData;
        setListProposalsIds(proposalsIds);
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
      onContractError(e);
      //@ts-ignore
      setIsError(e?.code ?? e);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      console.error(e);
    }
  }

  /**
   * Set proposal data in zustand store
   * id - id of proposal
   * data - data (content, author ENS/Eth address etc) of the proposal
   * votes - amount of votes received by the proposal
   * existsInDb - if the proposal is indexed in the database
   * shouldAddToDb - if the indexing process for this proposal should be triggered
   */
  async function fetchProposal(id: string, data: any, votes: number, existsInDb: boolean, shouldAddToDb: boolean) {
    const accountData = await getAccount();
    // Create an array of proposals
    // A proposal is a pair of data
    // A pair of a proposal data is [content, votes]
    const proposalDataPerId = results.reduce((result, value, index, array) => {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, []);

    const data = proposalDataPerId[i][0];
    const proposalData = {
      authorEthereumAddress: data[0],
      content: data[1],
      isContentImage: isUrlToImage(data[1]) ? true : false,
      exists: data[2] ?? true,
      //@ts-ignore
      votes: votes?.forVotes
        ? //@ts-ignore
          votes?.forVotes / 1e18 - votes?.againstVotes / 1e18
        : votes / 1e18,
    };
    // Check if that proposal belongs to the current user
    // (Needed to track if the current user can submit a proposal)
    //@ts-ignore
    if (data[0] === accountData?.address) {
      increaseCurrentUserProposalCount();
    }
    if (!existsInDb && shouldAddToDb) {
      indexProposal({
        id: id.toString(),
        contestNetworkName: chainName,
        contestAddress: address,
        authorAddress: proposalData.authorEthereumAddress,
        content: proposalData.content,
        isContentImage: proposalData.isContentImage,
        exists: proposalData.exists,
      });
    }
    setProposalData({ id, data: proposalData });
  }

  /**
   * Fetch the data of each proposals in page X
   * @param pageIndex - index of the page of proposals to fetch
   * @param slice - Array of proposals ids to be fetched
   * @param totalPagesPaginationProposals - total of pages in the pagination
   */
  async function fetchProposalsPage(pageIndex: number, slice: Array<any>, totalPagesPaginationProposals: number) {
    try {
      setCurrentPagePaginationProposals(pageIndex);
      setIsPageProposalsLoading(true);
      setIsPageProposalsError(null);
      //@ts-ignore
      setSliceOfProposalsIdsToFetch(slice);
      setHasPaginationProposalsNextPage(pageIndex + 1 < totalPagesPaginationProposals);
    } catch (e) {
      console.error(e);
      setIsPageProposalsLoading(false);
      //@ts-ignore
      setIsPageProposalsError(e?.message ?? e);
    }
  }

  /**
   * Update the amount of votes casted in this contest by the current user
   */
  async function updateCurrentUserVotes() {
    const abi = await getContestContractVersion(address, chainName);
    if (abi === null) {
      toast.error("This contract doesn't exist on this chain.");
      setIsError("This contract doesn't exist on this chain.");
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsLoading(false);
      return;
    }

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
      chainId: chainId,
    };

    try {
      // get current block number
      const currentBlockNumber = await fetchBlockNumber();
      const timestamp = (await provider.getBlock(currentBlockNumber)).timestamp - 50; // (necessary to avoid block not mined error)
      const accountData = await getAccount();

      const contracts = [
        // get current user availables votes now
        {
          ...contractConfig,
          functionName: "getVotes",
          //@ts-ignore
          args: [accountData?.address, timestamp],
        },
        // get votes cast by current user
        {
          ...contractConfig,
          functionName: "contestAddressTotalVotesCast",
          //@ts-ignore
          args: accountData?.address,
        },
      ];

      const results = await readContracts({ contracts });
      const currentUserAvailableVotesAmount = results[0];
      const currentUserTotalVotesCast = results[1];
      //@ts-ignore
      setCurrentUserTotalVotesCast(currentUserTotalVotesCast / 1e18);
      //@ts-ignore
      setCurrentUserAvailableVotesAmount(
        //@ts-ignore
        currentUserAvailableVotesAmount / 1e18 - currentUserTotalVotesCast / 1e18,
      );
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (isPageProposalsLoading && sliceOfProposalsIdsToFetch.length > 0) {
      const lastElementToLoadId = sliceOfProposalsIdsToFetch.slice(-1)[0];
      const lastElementVotes = listProposalsData?.[lastElementToLoadId]?.votes;
      const numberOfDataLoaded = sliceOfProposalsIdsToFetch.filter(id => {
        return listProposalsData?.[id];
      }).length;
      if (lastElementVotes >= 0 && numberOfDataLoaded === sliceOfProposalsIdsToFetch.length) {
        setIsPageProposalsLoading(false);
      }
    }
  }, [listProposalsData, sliceOfProposalsIdsToFetch, isPageProposalsLoading]);

  return {
    queryProposals,
    fetchProposalsPage,
    address,
    fetchContestInfo,
    setIsLoading,
    setIsListProposalsLoading,
    chainId,
    setChainId,
    isLoading,
    isListProposalsLoading,
    isError,
    isListProposalsError,
    isSuccess,
    isListProposalsSuccess,
    checkCurrentUserAmountOfProposalTokens,
    updateCurrentUserVotes,
    checkIfCurrentUserQualifyToVote,
    setChainName,
    refreshProposals: async () => {
      const abi = await getContestContractVersion(address, chainName);
      fetchProposalsIdsList(abi);
    },
    retry: fetchContestInfo,
    onSearch: (addr: string, chainName: string) => {
      setChainName(chainName);
      setChainId(chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id);
      setIsLoading(true);
      setIsPageProposalsLoading(true);
      setIsListProposalsLoading(true);
      setListProposalsIds([]);
      resetListProposals();
      setAddress(addr);
    },
  };
}

export default useContest;
