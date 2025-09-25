import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { getChainId } from "@helpers/getChainId";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { getNativeTokenSymbol } from "@helpers/nativeToken";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { JK_LABS_SPLIT_DESTINATION_DEFAULT } from "@hooks/useDeployContest";
import { SplitFeeDestinationType, VoteType } from "@hooks/useDeployContest/types";
import { useError } from "@hooks/useError";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { VOTE_AND_EARN_VERSION } from "@hooks/useUser/utils";
import { readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { checkIfContestExists } from "lib/contests";
import { getRewardsModuleAddress } from "lib/rewards/contracts";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Abi } from "viem";
import { createResultGetter } from "./helpers";
import { ErrorType, useContestStore } from "./store";
import { getContracts } from "./v3v4/contracts";

interface ContractConfigResult {
  contractConfig: {
    address: `0x${string}`;
    abi: any;
    chainId: number;
  };
  version: string;
}

export interface ContractConfig {
  address: `0x${string}`;
  abi: any;
  chainId: number;
}

export function useContest() {
  const asPath = usePathname();
  const { chainName: chainFromUrl, address: addressFromUrl } = extractPathSegments(asPath ?? "");
  const [chainName, setChainName] = useState(chainFromUrl);
  const [address, setAddress] = useState(addressFromUrl);
  const [chainId, setChainId] = useState(
    chains.filter((chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainFromUrl)?.[0]?.id,
  );
  const {
    setError,
    isLoading,
    error,
    isSuccess,
    setIsSuccess,
    setIsLoading,
    setContestPrompt,
    setContestName,
    setContestAuthor,
    setContestMaxProposalCount,
    setIsV3,
    setVotesClose,
    setVotesOpen,
    setSubmissionsOpen,
    setCharge,
    setSortingEnabled,
    setRewardsModuleAddress,
    setCanEditTitleAndDescription,
  } = useContestStore(state => state);
  const { setContestConfig } = useContestConfigStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading, setListProposalsIds } = useProposalStore(
    state => state,
  );
  const { setContestMaxNumberSubmissionsPerUser } = useUserStore(state => state);
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();
  const { fetchProposalsIdsList } = useProposal();
  const { setContestState } = useContestStateStore(state => state);
  const { error: errorMessage, handleError } = useError();

  // Generate config for the contract
  async function getContractConfig(): Promise<ContractConfigResult | undefined> {
    try {
      const { abi, version } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        setError(ErrorType.RPC);
        setIsSuccess(false);
        setIsListProposalsSuccess(false);
        setIsListProposalsLoading(false);
        setIsLoading(false);
        return;
      }

      const contractConfig = {
        address: address as `0x${string}`,
        abi: abi,
        chainId: chainId,
      };

      setContestConfigData(addressFromUrl, chainFromUrl, abi as Abi, version);

      return { contractConfig, version };
    } catch (e) {
      setError(ErrorType.CONTRACT);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
    }
  }

  async function fetchContestContractData(
    contractConfig: ContractConfig,
    version: string,
    rewardsModuleAddress?: string,
  ) {
    try {
      const contracts = getContracts(contractConfig, version);
      const results = await readContracts(config, { contracts });

      setIsV3(true);

      const getResultByName = createResultGetter(contracts, results);

      const contestName = getResultByName("name") as string;
      const contestAuthor = getResultByName("creator") as string;
      const contestMaxNumberSubmissionsPerUser = Number(getResultByName("numAllowedProposalSubmissions"));
      const contestMaxProposalCount = Number(getResultByName("maxProposalCount"));
      const submissionsOpenDate = new Date(Number(getResultByName("contestStart")) * 1000 + 1000);
      const closingVoteDate = new Date(Number(getResultByName("contestDeadline")) * 1000 + 1000);
      const votesOpenDate = new Date(Number(getResultByName("voteStart")) * 1000 + 1000);
      const contestPrompt = getResultByName("prompt") as string;
      const contestState = getResultByName("state") as ContestStateEnum;

      if (compareVersions(version, "4.2") >= 0) {
        const sortingEnabled = Number(getResultByName("sortingEnabled")) === 1;
        setSortingEnabled(sortingEnabled);
      }

      if (compareVersions(version, "4.27") >= 0) {
        setCanEditTitleAndDescription(true);
      }

      const percentageToCreator = Number(getResultByName("percentageToCreator")) || 0;
      const costToPropose = Number(getResultByName("costToPropose")) || 0;
      let costToVote = 0;
      let payPerVote = 1;
      let creatorSplitDestination = "";

      if (compareVersions(version, "4.23") >= 0) {
        costToVote = Number(getResultByName("costToVote")) || 0;
      }

      if (compareVersions(version, "4.25") >= 0 && compareVersions(version, "6.1") < 0) {
        payPerVote = Number(getResultByName("payPerVote"));
      }

      if (compareVersions(version, "4.29") >= 0) {
        creatorSplitDestination = (getResultByName("creatorSplitDestination") as string) || "";
      }

      setCharge({
        percentageToCreator,
        voteType: payPerVote > 0 ? VoteType.PerVote : VoteType.PerTransaction,
        splitFeeDestination: {
          type: determineSplitFeeDestination(
            creatorSplitDestination,
            percentageToCreator,
            contestAuthor,
            rewardsModuleAddress,
          ),
          address: creatorSplitDestination,
        },
        type: {
          costToPropose,
          costToVote,
        },
      });

      setContestName(contestName);
      setContestAuthor(contestAuthor);
      setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser);
      setContestMaxProposalCount(contestMaxProposalCount);
      setSubmissionsOpen(submissionsOpenDate);
      setVotesClose(closingVoteDate);
      setVotesOpen(votesOpenDate);
      setContestPrompt(contestPrompt);
      setContestState(contestState);
      setError(null);
      setIsSuccess(true);
      setIsLoading(false);

      await fetchProposalsIdsList(contractConfig, version, {
        submissionOpen: submissionsOpenDate,
        votesOpen: votesOpenDate,
      });
    } catch (error) {
      console.error("Error in fetchContestContractData:", error);
      setError(ErrorType.CONTRACT);
      setIsLoading(false);
      setIsSuccess(false);
      throw error;
    }
  }

  async function fetchV3ContestInfo(contractConfig: ContractConfig, version: string, rewardsModuleAddress?: string) {
    try {
      setIsListProposalsLoading(false);

      await Promise.all([
        fetchContestContractData(contractConfig, version, rewardsModuleAddress),
        processUserQualifications(contractConfig, version),
      ]);
    } catch (e) {
      handleError(e, "Something went wrong while fetching the contest data.");
      setError(ErrorType.CONTRACT);
      setIsLoading(false);
      setIsListProposalsLoading(false);
    }
  }

  /**
   * Fetch contest data from the contract, depending on the version of the contract
   */
  async function fetchContestInfo() {
    setIsLoading(true);
    try {
      const [abiResult, isContestFromJokerace] = await Promise.all([
        getContractConfig(),
        checkIfContestExists(addressFromUrl, chainFromUrl),
      ]);

      if (!abiResult) {
        setIsLoading(false);
        return;
      }

      if (!isContestFromJokerace) {
        setError(ErrorType.IS_NOT_JOKERACE_CONTRACT);
        setIsLoading(false);
        return;
      }

      const { contractConfig, version } = abiResult;

      const rewardsModuleAddress = await fetchRewardsModuleData(contractConfig);

      if (compareVersions(version, "4.0") < 0) {
        setError(ErrorType.UNSUPPORTED_VERSION);
        setIsLoading(false);
        console.error(`Contest version ${version} is not supported. Only v4.0 and above are supported.`);
        return;
      }

      // Fetch contest info for v4 and above
      await fetchV3ContestInfo(contractConfig, version, rewardsModuleAddress);
    } catch (error) {
      console.error("An error occurred while fetching data:", error);
    }
  }

  async function fetchRewardsModuleData(contractConfig: ContractConfig) {
    const moduleAddress = await getRewardsModuleAddress(contractConfig);

    if (!moduleAddress) {
      return "";
    }

    setRewardsModuleAddress(moduleAddress);

    return moduleAddress;
  }

  /**
   * Fetch user qualifications
   */
  async function processUserQualifications(contractConfig: ContractConfig, version: string) {
    if (compareVersions(version, VOTE_AND_EARN_VERSION) <= 0) return;

    await Promise.all([
      checkIfCurrentUserQualifyToSubmit(contractConfig),
      checkIfCurrentUserQualifyToVote(contractConfig),
    ]);
  }

  function determineSplitFeeDestination(
    splitFeeDestination: string,
    percentageToCreator: number,
    creatorWalletAddress: string,
    rewardsModuleAddress?: string,
  ): SplitFeeDestinationType {
    if (splitFeeDestination === JK_LABS_SPLIT_DESTINATION_DEFAULT || percentageToCreator === 0) {
      return SplitFeeDestinationType.NoSplit;
    }

    if (splitFeeDestination === creatorWalletAddress) {
      return SplitFeeDestinationType.CreatorWallet;
    }

    if (rewardsModuleAddress && splitFeeDestination === rewardsModuleAddress) {
      return SplitFeeDestinationType.RewardsPool;
    }

    return SplitFeeDestinationType.AnotherWallet;
  }

  function setContestConfigData(contestAddress: string, contestChainName: string, abi: Abi, version: string) {
    const contestChainNativeCurrencySymbol = getNativeTokenSymbol(contestChainName);
    const chainId = getChainId(contestChainName);

    setContestConfig({
      address: contestAddress as `0x${string}`,
      chainName: contestChainName,
      chainId,
      chainNativeCurrencySymbol: contestChainNativeCurrencySymbol ?? "",
      abi: abi as Abi,
      version,
    });
  }

  return {
    getContractConfig,
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
      setChainId(
        chains.filter((chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id,
      );
      setIsLoading(true);
      setIsListProposalsLoading(true);
      setListProposalsIds([]);
      setAddress(addr);
    },
  };
}

export default useContest;
