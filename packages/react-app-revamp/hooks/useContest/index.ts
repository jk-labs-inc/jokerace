import { chains, config } from "@config/wagmi";
import { isAlchemyConfigured } from "@helpers/alchemy";
import { isSupabaseConfigured } from "@helpers/database";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import { MAX_MS_TIMEOUT } from "@helpers/timeout";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useError } from "@hooks/useError";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser, { EMPTY_ROOT } from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { GetBalanceReturnType, readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { differenceInMilliseconds, differenceInMinutes, isBefore, minutesToMilliseconds } from "date-fns";
import { utils } from "ethers";
import { fetchFirstToken, fetchNativeBalance, fetchTokenBalances } from "lib/contests";
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { useContestStore } from "./store";
import { getV1Contracts } from "./v1/contracts";
import { getContracts } from "./v3v4/contracts";
import { VoteType } from "@hooks/useDeployContest/types";

interface ContractConfigResult {
  contractConfig: {
    address: `0x${string}`;
    abi: any;
    chainId: number;
  };
  version: string;
}

interface ContractConfig {
  address: `0x${string}`;
  abi: any;
  chainId: number;
}

export function useContest() {
  const router = useRouter();
  const { asPath } = router;
  const { chainName: chainFromUrl, address: addressFromUrl } = extractPathSegments(asPath);
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
    setSupportsRewardsModule,
    setContestPrompt,
    setDownvotingAllowed,
    setContestName,
    setContestAuthor,
    setContestMaxProposalCount,
    setIsV3,
    setSubmissionsMerkleRoot,
    setVotingMerkleRoot,
    setVotesClose,
    setVotesOpen,
    setRewards,
    setSubmissionsOpen,
    setCanUpdateVotesInRealTime,
    setCharge,
    setVotingRequirements,
    setSubmissionRequirements,
    setIsReadOnly,
    setIsRewardsLoading,
    setSortingEnabled,
  } = useContestStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading, setListProposalsIds } = useProposalStore(
    state => state,
  );
  const { setContestMaxNumberSubmissionsPerUser } = useUserStore(state => state);
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();
  const { fetchProposalsIdsList } = useProposal();
  const { contestStatus } = useContestStatusStore(state => state);
  const { error: errorMessage, handleError } = useError();
  const alchemyRpc = chains
    .filter((chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.[0]
    ?.rpcUrls.default.http[0].includes("alchemy");

  // Generate config for the contract
  async function getContractConfig(): Promise<ContractConfigResult | undefined> {
    try {
      const { abi, version } = await getContestContractVersion(address, chainId);

      if (abi === null) {
        const errorMessage = `RPC call failed`;
        setError(errorMessage);
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

      return { contractConfig, version };
    } catch (e) {
      setError(errorMessage);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
    }
  }

  async function fetchContestContractData(contractConfig: ContractConfig, version: string) {
    const contracts = getContracts(contractConfig, version);
    const results = await readContracts(config, { contracts });
    setIsV3(true);

    const contestName = results[0].result as string;
    const contestAuthor = results[1].result as string;
    const contestMaxNumberSubmissionsPerUser = Number(results[2].result);
    const contestMaxProposalCount = Number(results[3].result);
    const submissionsOpenDate = new Date(Number(results[4].result) * 1000 + 1000);
    const closingVoteDate = new Date(Number(results[5].result) * 1000 + 1000);
    const votesOpenDate = new Date(Number(results[6].result) * 1000 + 1000);
    const contestPrompt = results[7].result as string;
    const isDownvotingAllowed = Number(results[8].result) === 1;
    const submissionMerkleRoot = results[9].result as string;
    const votingMerkleRoot = results[10].result as string;

    processUserQualifications(submissionMerkleRoot, votingMerkleRoot, contestMaxNumberSubmissionsPerUser);

    if (compareVersions(version, "4.0") >= 0) {
      const costToProposeTiming = moment().isBefore(votesOpenDate);
      const costToVoteTiming = moment().isBefore(closingVoteDate);
      const percentageToCreator = Number(results[11].result);
      let costToPropose = 0;
      let costToVote = 0;
      let payPerVote = 0;

      if (costToProposeTiming) {
        costToPropose = Number(results[12].result);
      }

      if (costToVoteTiming && compareVersions(version, "4.23") >= 0) {
        if (compareVersions(version, "4.25") >= 0) {
          payPerVote = Number(results[15].result);
        }
        costToVote = Number(results[14].result);
      }

      console.log(costToVote);

      setCharge({
        percentageToCreator,
        voteType: payPerVote > 0 ? VoteType.PerVote : VoteType.PerTransaction,
        type: {
          costToPropose,
          costToVote,
        },
      });
    } else {
      setCharge(null);
    }

    if (compareVersions(version, "4.2") >= 0) {
      const sortingEnabled = Number(results[13].result) === 1;

      setSortingEnabled(sortingEnabled);
    }

    setContestName(contestName);
    setContestAuthor(contestAuthor, contestAuthor);
    setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser);
    setContestMaxProposalCount(contestMaxProposalCount);
    setSubmissionsOpen(submissionsOpenDate);
    setVotesClose(closingVoteDate);
    setVotesOpen(votesOpenDate);
    setContestPrompt(contestPrompt);
    setDownvotingAllowed(isDownvotingAllowed);

    // We want to track VoteCast event only 2H before the end of the contest, and only if alchemy support is enabled and if alchemy is configured
    if (isBefore(new Date(), closingVoteDate) && alchemyRpc && isAlchemyConfigured) {
      if (differenceInMinutes(closingVoteDate, new Date()) <= 120) {
        setCanUpdateVotesInRealTime(true);
      } else {
        setCanUpdateVotesInRealTime(false);

        let delayBeforeVotesCanBeUpdated =
          differenceInMilliseconds(closingVoteDate, new Date()) - minutesToMilliseconds(120);

        // Cap the delay at the maximum allowable value to prevent overflow
        delayBeforeVotesCanBeUpdated = Math.min(delayBeforeVotesCanBeUpdated, MAX_MS_TIMEOUT);

        setTimeout(() => {
          setCanUpdateVotesInRealTime(true);
        }, delayBeforeVotesCanBeUpdated);
      }
    } else {
      setCanUpdateVotesInRealTime(false);
    }

    setError("");
    setIsSuccess(true);
    setIsLoading(false);

    await fetchProposalsIdsList(contractConfig.abi, {
      submissionOpen: submissionsOpenDate,
      votesOpen: votesOpenDate,
    });
  }

  async function fetchV3ContestInfo(
    contractConfig: ContractConfig,
    contestRewardModuleAddress: string | undefined,
    version: string,
  ) {
    try {
      setIsListProposalsLoading(false);

      await Promise.all([
        fetchContestContractData(contractConfig, version),
        processRewardData(contestRewardModuleAddress),
        processRequirementsData(),
      ]);
    } catch (e) {
      handleError(e, "Something went wrong while fetching the contest data.");
      setError(errorMessage);
      setIsLoading(false);
      setIsListProposalsLoading(false);
      setIsRewardsLoading(false);
    }
  }

  async function fetchV1ContestInfo(contractConfig: ContractConfig, version: string) {
    try {
      const contracts = getV1Contracts(contractConfig);
      const results = await readContracts(config, { contracts });

      setIsV3(false);

      const closingVoteDate = new Date(Number(results[6].result) * 1000 + 1000);
      const submissionsOpenDate = new Date(Number(results[5].result) * 1000 + 1000);
      const votesOpenDate = new Date(Number(results[7].result) * 1000 + 1000);
      const contestMaxNumberSubmissionsPerUser = Number(results[2].result);
      const contestMaxProposalCount = Number(results[3].result);

      setContestName(results[0].result as string);
      setContestAuthor(results[1].result as string, results[1].result as string);
      setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser);
      setContestMaxProposalCount(contestMaxProposalCount);
      setSubmissionsOpen(submissionsOpenDate);
      setVotesClose(closingVoteDate);
      setVotesOpen(votesOpenDate);

      const promptFilter = contractConfig.abi?.filter((el: { name: string }) => el.name === "prompt");
      const submissionGatingFilter = contractConfig.abi?.filter(
        (el: { name: string }) => el.name === "submissionGatingByVotingToken",
      );
      const downvotingFilter = contractConfig.abi?.filter((el: { name: string }) => el.name === "downvotingAllowed");

      if (promptFilter.length > 0) {
        const indexToCheck = submissionGatingFilter.length > 0 ? 4 : downvotingFilter.length > 0 ? 2 : 1;
        setContestPrompt(results[contracts.length - indexToCheck].result as string);
      }

      setError("");
      setIsSuccess(true);
      setIsLoading(false);

      // List of proposals for this contest
      await fetchProposalsIdsList(contractConfig.abi, {
        submissionOpen: submissionsOpenDate,
        votesOpen: votesOpenDate,
      });

      setIsListProposalsLoading(false);
    } catch (e) {
      handleError(e, "Something went wrong while fetching the contest data.");
      setError(errorMessage);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
    }
  }

  /**
   * Fetch contest data from the contract, depending on the version of the contract
   */
  async function fetchContestInfo() {
    setIsLoading(true);
    const result = await getContractConfig();

    if (!result) {
      setIsLoading(false);
      return;
    }

    const { contractConfig, version } = result;

    let contestRewardModuleAddress: string | undefined;

    if (contractConfig.abi?.filter((el: { name: string }) => el.name === "officialRewardsModule").length > 0) {
      contestRewardModuleAddress = (await readContract(config, {
        ...contractConfig,
        functionName: "officialRewardsModule",
        args: [],
      })) as any;
      if (contestRewardModuleAddress?.toString() == "0x0000000000000000000000000000000000000000") {
        setSupportsRewardsModule(false);
        contestRewardModuleAddress = undefined;
      } else {
        setSupportsRewardsModule(true);
        contestRewardModuleAddress = contestRewardModuleAddress?.toString();
      }
    } else {
      setSupportsRewardsModule(false);
      contestRewardModuleAddress = undefined;
    }

    if (contestRewardModuleAddress) {
      setIsRewardsLoading(true);
    }

    if (compareVersions(version, "3.0") == -1) {
      await fetchV1ContestInfo(contractConfig, version);
    } else {
      await fetchV3ContestInfo(contractConfig, contestRewardModuleAddress, version);
    }
  }

  /**
   * Fetch merkle tree data from DB and re-create the tree
   */
  async function processUserQualifications(
    submissionMerkleRoot: string,
    votingMerkleRoot: string,
    contestMaxNumberSubmissionsPerUser: number,
  ) {
    if (contestStatus === ContestStatus.VotingClosed) return;

    setSubmissionsMerkleRoot(submissionMerkleRoot);
    setVotingMerkleRoot(votingMerkleRoot);

    if (!isSupabaseConfigured) {
      setIsReadOnly(true);
      if (submissionMerkleRoot === EMPTY_ROOT) {
        await checkIfCurrentUserQualifyToSubmit(submissionMerkleRoot, contestMaxNumberSubmissionsPerUser);
        return;
      } else {
        return;
      }
    }

    await Promise.all([
      checkIfCurrentUserQualifyToSubmit(submissionMerkleRoot, contestMaxNumberSubmissionsPerUser),
      checkIfCurrentUserQualifyToVote(),
    ]);
  }

  async function processRequirementsData() {
    if (!isSupabaseConfigured) return;

    const config = await import("@config/supabase");
    const supabase = config.supabase;

    try {
      const result = await supabase
        .from("contests_v3")
        .select("voting_requirements, submission_requirements")
        .eq("address", address)
        .eq("network_name", chainName);

      if (result.data) {
        const { voting_requirements, submission_requirements } = result.data[0];
        setVotingRequirements(voting_requirements || null);
        setSubmissionRequirements(submission_requirements || null);
      }
    } catch (error) {
      setVotingRequirements(null);
      setSubmissionRequirements(null);
    }
  }

  /**
   * Fetch reward data from the rewards module contract
   * @param contestRewardModuleAddress
   * @returns
   */
  async function processRewardData(contestRewardModuleAddress: string | undefined) {
    if (!contestRewardModuleAddress) return;

    const abiRewardsModule = await getRewardsModuleContractVersion(contestRewardModuleAddress, chainId);

    if (!abiRewardsModule) {
      setRewards(null);
    } else {
      const winners = (await readContract(config, {
        address: contestRewardModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        chainId: chainId,
        functionName: "getPayees",
      })) as any[];

      let rewardToken: GetBalanceReturnType | null = null;
      let erc20Tokens: any = null;

      rewardToken = await fetchNativeBalance(contestRewardModuleAddress, chainId);

      if (!rewardToken || rewardToken.value.toString() == "0") {
        try {
          erc20Tokens = await fetchTokenBalances(chainName, contestRewardModuleAddress);

          if (erc20Tokens && erc20Tokens.length > 0) {
            rewardToken = await fetchFirstToken(contestRewardModuleAddress, chainId, erc20Tokens[0].contractAddress);
          }
        } catch (e) {
          console.error("Error fetching token balances:", e);
          return;
        }
      }

      if (rewardToken) {
        setRewards({
          token: {
            symbol: rewardToken.symbol,
            value: parseFloat(utils.formatUnits(rewardToken.value, rewardToken.decimals)),
          },
          winners: winners.length,
          numberOfTokens: erc20Tokens?.length ?? 1,
        });
      } else {
        setRewards(null);
      }

      setIsRewardsLoading(false);
    }
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
