import { supabase } from "@config/supabase";
import { chains } from "@config/wagmi";
import { CONTEST_STATUS } from "@helpers/contestStatus";
import getContestContractVersion from "@helpers/getContestContractVersion";
import useContestsIndex from "@hooks/useContestsIndex";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { fetchToken, getAccount, readContract, readContracts } from "@wagmi/core";
import { differenceInHours, differenceInMilliseconds, hoursToMilliseconds, isBefore } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { CustomError } from "types/error";
import { useNetwork } from "wagmi";
import { useContestStore } from "./store";
import { isSupabaseConfigured } from "@helpers/database";

export function useContest() {
  const { indexContest } = useContestsIndex();
  const { asPath } = useRouter();
  const { chain } = useNetwork();
  const [chainId, setChainId] = useState(
    chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")[2])?.[0]?.id,
  );
  const [address, setAddress] = useState(asPath.split("/")[3]);
  const [chainName, setChainName] = useState(asPath.split("/")[2]);
  const {
    setError,
    isLoading,
    error,
    isSuccess,
    setIsSuccess,
    setIsLoading,
    setSupportsRewardsModule,
    setContestPrompt,
    setDownvotingAllowed,
    setContestName,
    setContestAuthor,
    setContestMaxProposalCount,
    setVotingTokenAddress,
    setVotingToken,
    setVotesClose,
    setVotesOpen,
    setSubmissionsOpen,
    setCanUpdateVotesInRealTime,
    setContestStatus,
    setSubmitProposalToken,
    setSubmitProposalTokenAddress,
  } = useContestStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading, setListProposalsIds, resetListProposals } =
    useProposalStore(state => state);
  const {
    setCheckIfUserPassedSnapshotLoading,
    setContestMaxNumberSubmissionsPerUser,
    setAmountOfTokensRequiredToSubmitEntry,
    setIsLoading: setIsUserStoreLoading,
  } = useUserStore(state => state);
  const { checkCurrentUserAmountOfProposalTokens, checkIfCurrentUserQualifyToVote, updateCurrentUserVotes } = useUser();
  const { fetchProposalsIdsList, fetchProposalsPage } = useProposal();

  /**
   * Display an error toast in the UI for any contract related error
   */
  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
    toast.error(toastMessage);
  }

  function getContracts(contractConfig: any) {
    const contractFunctionNames = [
      "name",
      "creator",
      "numAllowedProposalSubmissions",
      "maxProposalCount",
      "token",
      "contestStart",
      "contestDeadline",
      "voteStart",
      "state",
      "proposalThreshold",
    ];

    const contracts = contractFunctionNames.map(functionName => ({
      ...contractConfig,
      functionName,
    }));

    if (contractConfig.contractInterface?.some(({ name }: any) => name === "prompt")) {
      contracts.push({
        ...contractConfig,
        functionName: "prompt",
      });
    }
    if (contractConfig.contractInterface?.some(({ name }: any) => name === "downvotingAllowed")) {
      contracts.push({
        ...contractConfig,
        functionName: "downvotingAllowed",
      });
    }
    if (contractConfig.contractInterface?.some(({ name }: any) => name === "submissionGatingByVotingToken")) {
      contracts.push(
        {
          ...contractConfig,
          functionName: "submissionGatingByVotingToken",
        },
        {
          ...contractConfig,
          functionName: "submissionToken",
        },
      );
    }

    return contracts;
  }

  // Generate config for the contract
  async function getContractConfig() {
    const abi = await getContestContractVersion(address, chainName);
    if (abi === null) {
      toast.error(`This contract doesn't exist on ${chain?.name ?? "this chain"}.`);
      setError({ message: `This contract doesn't exist on ${chain?.name ?? "this chain"}.` });
      setIsSuccess(false);
      setCheckIfUserPassedSnapshotLoading(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
      return;
    }

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
      chainId: chainId,
    };

    return contractConfig;
  }

  /**
   * Fetch all info of a contest (title, prompt, list of proposals etc.)
   */
  async function fetchContestInfo() {
    setIsLoading(true);
    setIsUserStoreLoading(true);
    const contractConfig = await getContractConfig();

    if (!contractConfig) return;

    const contracts = getContracts(contractConfig);
    const accountData = getAccount();

    try {
      if (contractConfig.contractInterface?.filter(el => el.name === "officialRewardsModule").length > 0) {
        const contestRewardModuleAddress = await readContract({
          ...contractConfig,
          functionName: "officialRewardsModule",
        });
        if (contestRewardModuleAddress.toString() == "0x0000000000000000000000000000000000000000") {
          setSupportsRewardsModule(false);
        } else {
          setSupportsRewardsModule(true);
        }
      } else {
        setSupportsRewardsModule(false);
      }

      const results = await readContracts({ contracts });

      // If current page is proposal, fetch proposal with id
      if (asPath.includes("/proposal/")) {
        await fetchProposalsPage(0, [asPath.split("/")[5]], 1);
      }

      // List of proposals for this contest
      await fetchProposalsIdsList(contractConfig.contractInterface);

      setContestName(results[0].toString());
      setContestAuthor(results[1].toString(), results[1].toString());
      //@ts-ignore
      setContestMaxNumberSubmissionsPerUser(results[2]);
      //@ts-ignore
      setContestMaxProposalCount(results[3]);
      setVotingTokenAddress(results[4]);
      // Voting token data (balance, symbol, total supply etc) (for ERC-20 token)

      const votingTokenRawData = await fetchToken({ address: results[4].toString(), chainId });
      //@ts-ignore
      const closingVoteDate = new Date(parseInt(results[6]) * 1000);
      setVotingToken(votingTokenRawData);
      //@ts-ignore
      setSubmissionsOpen(new Date(parseInt(results[5]) * 1000));
      //@ts-ignore
      setVotesOpen(new Date(parseInt(results[7]) * 1000));
      setVotesClose(closingVoteDate);

      setError(null);
      setIsSuccess(true);
      setIsLoading(false);
      setIsListProposalsLoading(false);

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
        //@ts-ignore
        setContestStatus(results[8]);
      }

      const promptFilter = contractConfig.contractInterface?.filter(el => el.name === "prompt");
      const submissionGatingFilter = contractConfig.contractInterface?.filter(
        el => el.name === "submissionGatingByVotingToken",
      );
      const downvotingFilter = contractConfig.contractInterface?.filter(el => el.name === "downvotingAllowed");

      if (promptFilter.length > 0) {
        const indexToCheck = submissionGatingFilter.length > 0 ? 4 : downvotingFilter.length > 0 ? 2 : 1;
        setContestPrompt(results[contracts.length - indexToCheck].toString());
      }

      setDownvotingAllowed(
        downvotingFilter.length > 0
          ? parseInt(
              results[submissionGatingFilter.length > 0 ? contracts.length - 3 : contracts.length - 1].toString(),
            ) === 1
          : false,
      );

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

      //@ts-ignore
      setAmountOfTokensRequiredToSubmitEntry(results[9] / 1e18);

      if (contractConfig.contractInterface?.filter(el => el.name === "submissionGatingByVotingToken").length > 0) {
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
        setIsUserStoreLoading(false);
      }

      // If this contest doesn't exist in the database, index it
      if (isSupabaseConfigured) {
        const indexingResult = await supabase.from("contests").select("*").eq("address", address);
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
    getContractConfig,
    onContractError,
    address,
    fetchContestInfo,
    setIsLoading,
    chainId,
    chainName,
    setChainId,
    isLoading,
    error,
    isSuccess,
    setChainName,
    retry: fetchContestInfo,
    onSearch: (addr: string, chainName: string) => {
      setChainName(chainName);
      setChainId(chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id);
      setIsLoading(true);
      setIsListProposalsLoading(true);
      setListProposalsIds([]);
      resetListProposals();
      setAddress(addr);
    },
  };
}

export default useContest;
