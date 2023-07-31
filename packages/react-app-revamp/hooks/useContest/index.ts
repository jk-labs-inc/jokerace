import { toastError } from "@components/UI/Toast";
import { supabase } from "@config/supabase";
import { chains } from "@config/wagmi";
import { useEthersProvider } from "@helpers/ethers";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { FetchBalanceResult, readContract, readContracts } from "@wagmi/core";
import { differenceInHours, differenceInMilliseconds, hoursToMilliseconds, isBefore } from "date-fns";
import { utils } from "ethers";
import { fetchFirstToken, fetchNativeBalance, fetchTokenBalances } from "lib/contests";
import { generateMerkleTree, Recipient } from "lib/merkletree/generateMerkleTree";
import { useRouter } from "next/router";
import { useState } from "react";
import { CustomError } from "types/error";
import { useNetwork } from "wagmi";
import { useContestStore } from "./store";
import { getV1Contracts } from "./v1/contracts";
import { getV3Contracts } from "./v3/contracts";

interface ContractConfigResult {
  contractConfig: {
    address: `0x${string}`;
    abi: any;
    chainId: number;
  };
  version: string;
}

export function useContest() {
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
    setIsV3,
    setVotingMerkleTree,
    setVoters,
    setSubmitters,
    setTotalVotesCast,
    setTotalVotes,
    setSubmissionMerkleTree,
    setVotesClose,
    setVotesOpen,
    setRewards,
    setSubmissionsOpen,
    setCanUpdateVotesInRealTime,
  } = useContestStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading, setListProposalsIds, resetListProposals } =
    useProposalStore(state => state);
  const { setContestMaxNumberSubmissionsPerUser, setIsLoading: setIsUserStoreLoading } = useUserStore(state => state);
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();
  const { fetchProposalsIdsList } = useProposal();
  const provider = useEthersProvider({ chainId });

  /**
   * Display an error toast in the UI for any contract related error
   */
  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
    toastError(toastMessage);
  }

  // Generate config for the contract
  async function getContractConfig(): Promise<ContractConfigResult | undefined> {
    try {
      const { abi, version } = await getContestContractVersion(address, provider);

      if (abi === null) {
        const errorMessage = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
        toastError(errorMessage);
        setError({ message: errorMessage });
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
    } catch (error) {}
  }

  /**
   * Fetch all info of a contest (title, prompt, list of proposals etc.)
   */
  async function fetchContestInfo() {
    setIsLoading(true);
    setIsUserStoreLoading(true);
    const result = await getContractConfig();

    if (!result) return; // if the result is undefined, just return

    const { contractConfig, version } = result;
    let contestRewardModuleAddress: string | undefined;

    if (contractConfig.abi?.filter((el: { name: string }) => el.name === "officialRewardsModule").length > 0) {
      contestRewardModuleAddress = (await readContract({
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

    if (parseFloat(version) >= 3) {
      try {
        const contracts = getV3Contracts(contractConfig);
        const results = await readContracts({ contracts });

        setIsV3(true);

        await fetchProposalsIdsList(contractConfig.abi);

        const closingVoteDate = new Date(Number(results[5].result) * 1000 + 1000);
        const submissionsOpenDate = new Date(Number(results[4].result) * 1000 + 1000);
        const votesOpenDate = new Date(Number(results[6].result) * 1000 + 1000);
        const isDownvotingAllowed = Number(results[9].result) === 1;
        const contestMaxNumberSubmissionsPerUser = Number(results[2].result);
        const contestMaxProposalCount = Number(results[3].result);

        setContestName(results[0].result as string);
        setContestAuthor(results[1].result as string, results[1].result as string);

        setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser);
        setContestMaxProposalCount(contestMaxProposalCount);
        setSubmissionsOpen(submissionsOpenDate);
        setVotesClose(closingVoteDate);
        setVotesOpen(votesOpenDate);
        setContestPrompt(results[8].result as string);

        setDownvotingAllowed(isDownvotingAllowed);

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

        await processRewardData(contestRewardModuleAddress);
        setError(null);
        setIsSuccess(true);
        setIsLoading(false);
        setIsListProposalsLoading(false);
        await processContestData(contestMaxNumberSubmissionsPerUser);
      } catch (error) {
        const customError = error as CustomError;
        if (!customError) return;

        setError(customError);
        toastError(`error while fetching contest data`, customError.message);
        setIsLoading(false);
        setIsUserStoreLoading(false);
        setIsListProposalsLoading(false);
      }
    } else {
      try {
        const contracts = getV1Contracts(contractConfig);
        const results = await readContracts({ contracts });

        setIsV3(false);

        // List of proposals for this contest
        await fetchProposalsIdsList(contractConfig.abi);

        setContestName(results[0].result as string);
        setContestAuthor(results[1].result as string, results[1].result as string);

        const contestMaxNumberSubmissionsPerUser = Number(results[2].result);
        const contestMaxProposalCount = Number(results[3].result);
        const closingVoteDate = new Date(Number(results[5].result) * 1000 + 1000);
        const submissionsOpenDate = new Date(Number(results[4].result) * 1000 + 1000);
        const votesOpenDate = new Date(Number(results[6].result) * 1000 + 1000);

        setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser);
        setContestMaxProposalCount(contestMaxProposalCount);
        setSubmissionsOpen(submissionsOpenDate);
        setVotesOpen(votesOpenDate);
        setVotesClose(closingVoteDate);

        setError(null);
        setIsSuccess(true);
        setIsLoading(false);
        setIsListProposalsLoading(false);

        const promptFilter = contractConfig.abi?.filter((el: { name: string }) => el.name === "prompt");
        const submissionGatingFilter = contractConfig.abi?.filter(
          (el: { name: string }) => el.name === "submissionGatingByVotingToken",
        );
        const downvotingFilter = contractConfig.abi?.filter((el: { name: string }) => el.name === "downvotingAllowed");

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
      } catch (e) {
        const customError = e as CustomError;

        if (!customError) return;

        onContractError(e);
        setError(customError);
        setIsSuccess(false);
        setIsListProposalsSuccess(false);
        setIsListProposalsLoading(false);
        setIsUserStoreLoading(false);
        setIsLoading(false);
      }
    }
  }

  async function processRewardData(contestRewardModuleAddress: string | undefined) {
    if (!contestRewardModuleAddress) return;

    const abiRewardsModule = await getRewardsModuleContractVersion(contestRewardModuleAddress, provider);

    if (!abiRewardsModule) {
      setRewards(null);
    } else {
      const winners = (await readContract({
        address: contestRewardModuleAddress as `0x${string}`,
        abi: abiRewardsModule,
        chainId: chainId,
        functionName: "getPayees",
      })) as any[];

      let rewardToken: FetchBalanceResult | null = null;
      let erc20Tokens: any = null;

      rewardToken = await fetchNativeBalance(contestRewardModuleAddress, chainId);

      if (!rewardToken || rewardToken.value.toString() == "0") {
        try {
          erc20Tokens = await fetchTokenBalances(chainName, contestRewardModuleAddress);

          if (erc20Tokens && erc20Tokens.length > 0) {
            rewardToken = await fetchFirstToken(contestRewardModuleAddress, chainId, erc20Tokens[0].contractAddress);
          }
        } catch (error) {
          console.error("Error fetching token balances:", error);
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
    }
  }

  /**
   * Fetch merkle tree data from DB and re-create the tree
   */
  async function processContestData(contestMaxNumberSubmissionsPerUser: number) {
    const { data } = await supabase
      .from("contests_v3")
      .select("submissionMerkleTree, votingMerkleTree")
      .eq("address", address)
      .eq("network_name", chainName);

    if (data && data.length > 0) {
      const { submissionMerkleTree: submissionMerkleTreeData, votingMerkleTree: votingMerkleTreeData } = data[0];

      let totalVotes = 0;
      const votesDataRecord: Record<string, number> = votingMerkleTreeData.voters.reduce(
        (acc: Record<string, number>, vote: Recipient) => {
          const numVotes = Number(vote.numVotes);
          acc[vote.address] = numVotes;
          totalVotes += numVotes;
          return acc;
        },
        {},
      );

      const votingMerkleTree = generateMerkleTree(18, votesDataRecord).merkleTree;
      setTotalVotes(totalVotes);
      setVoters(votingMerkleTreeData.voters);

      let submissionMerkleTree;

      if (
        !submissionMerkleTreeData ||
        submissionMerkleTreeData.merkleRoot === "0x0000000000000000000000000000000000000000000000000000000000000000"
      ) {
        submissionMerkleTree = generateMerkleTree(18, {}).merkleTree;
        setSubmitters([]);
      } else {
        const submissionsDataRecord: Record<string, number> = submissionMerkleTreeData.submitters.reduce(
          (acc: Record<string, number>, vote: Recipient) => {
            acc[vote.address] = Number(vote.numVotes);
            return acc;
          },
          {},
        );

        submissionMerkleTree = generateMerkleTree(18, submissionsDataRecord).merkleTree;
        setSubmitters(submissionMerkleTreeData.submitters);
      }

      await fetchTotalVotesCast();
      await checkIfCurrentUserQualifyToSubmit(submissionMerkleTree, contestMaxNumberSubmissionsPerUser);
      await checkIfCurrentUserQualifyToVote();
      setIsUserStoreLoading(false);
      setSubmissionMerkleTree(submissionMerkleTree);
      setVotingMerkleTree(votingMerkleTree);
    }
  }

  async function fetchTotalVotesCast() {
    try {
      const result = await getContractConfig();
      if (!result) return;

      const { contractConfig } = result;

      if (!(contractConfig.abi?.filter((el: { name: string }) => el.name === "totalVotesCast").length > 0)) {
        setTotalVotesCast(-1);
        return;
      }

      const totalVotesCast = await readContract({
        ...contractConfig,
        functionName: "totalVotesCast",
        args: [],
      });

      setTotalVotesCast(totalVotesCast ? Number(totalVotesCast) / 1e18 : 0);
    } catch {
      setTotalVotesCast(0);
    }
  }

  return {
    getContractConfig,
    onContractError,
    address,
    fetchContestInfo,
    fetchTotalVotesCast,
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
