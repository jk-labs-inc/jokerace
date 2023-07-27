import { toastError } from "@components/UI/Toast";
import { supabase } from "@config/supabase";
import { chains } from "@config/wagmi";
import { isAlchemyConfigured } from "@helpers/alchemy";
import { isSupabaseConfigured } from "@helpers/database";
import getContestContractVersion from "@helpers/getContestContractVersion";
import getRewardsModuleContractVersion from "@helpers/getRewardsModuleContractVersion";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser, { EMPTY_ROOT } from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { alchemyRpcUrls, FetchBalanceResult, readContract, readContracts } from "@wagmi/core";
import {
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  hoursToMilliseconds,
  isBefore,
  minutesToMilliseconds,
} from "date-fns";
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
    addressOrName: string;
    contractInterface: any;
    chainId: number;
  };
  version: string;
}

interface ContractConfig {
  addressOrName: string;
  contractInterface: any;
  chainId: number;
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
    setIsReadOnly,
  } = useContestStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading, setListProposalsIds, resetListProposals } =
    useProposalStore(state => state);
  const { setContestMaxNumberSubmissionsPerUser, setIsLoading: setIsUserStoreLoading } = useUserStore(state => state);
  const { checkIfCurrentUserQualifyToVote, checkIfCurrentUserQualifyToSubmit } = useUser();
  const { fetchProposalsIdsList } = useProposal();
  const networkName = chainName.toLowerCase() === "arbitrumone" ? "arbitrum" : chainName;
  const alchemyRpc = Object.keys(alchemyRpcUrls).filter(url => url.toLowerCase() === networkName)[0];

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
      const { abi, version } = await getContestContractVersion(address, chainName);

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

      const contractConfig: ContractConfig = {
        addressOrName: address,
        contractInterface: abi,
        chainId: chainId,
      };

      return { contractConfig, version };
    } catch (error) {
      const customError = error as CustomError;
      if (!customError) return;

      onContractError(error);
      setError(customError);
      setIsSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsLoading(false);
    }
  }

  async function fetchV3ContestInfo(contractConfig: ContractConfig, contestRewardModuleAddress: string | undefined) {
    try {
      const contracts = getV3Contracts(contractConfig);
      const results = await readContracts({ contracts });

      setIsV3(true);

      await fetchProposalsIdsList(contractConfig.contractInterface);

      //@ts-ignore
      const closingVoteDate = new Date(parseInt(results[5] * 1000) + 1000);

      setContestName(results[0].toString());
      setContestAuthor(results[1].toString(), results[1].toString());

      const contestMaxNumberSubmissionsPerUser = parseFloat(results[2].toString());
      setContestMaxNumberSubmissionsPerUser(contestMaxNumberSubmissionsPerUser);
      setContestMaxProposalCount(parseFloat(results[3].toString()));

      //@ts-ignore
      setSubmissionsOpen(new Date(parseInt(results[4]) * 1000 + 1000));
      setVotesClose(closingVoteDate);
      //@ts-ignore
      setVotesOpen(new Date(parseInt(results[6]) * 1000 + 1000));
      setContestPrompt(results[8].toString());
      setDownvotingAllowed(results[9].eq(1));

      const submissionMerkleRoot = results[10].toString();

      // We want to track VoteCast event only 2H before the end of the contest, and only if alchemy support is enabled and if alchemy is configured
      if (isBefore(new Date(), closingVoteDate) && alchemyRpc && isAlchemyConfigured) {
        if (differenceInMinutes(closingVoteDate, new Date()) <= 120) {
          // If the difference between the closing date (end of votes) and now is <= to 2h
          // reflect this in the state
          setCanUpdateVotesInRealTime(true);
        } else {
          setCanUpdateVotesInRealTime(false);
          // Otherwise, update the state 2h before the closing date (end of votes)
          const delayBeforeVotesCanBeUpdated =
            differenceInMilliseconds(closingVoteDate, new Date()) - minutesToMilliseconds(120);
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
      await processContestData(submissionMerkleRoot, contestMaxNumberSubmissionsPerUser);
    } catch (error) {
      const customError = error as CustomError;
      if (!customError) return;

      setError(customError);
      toastError(`error while fetching contest data`, customError.message);
      setIsLoading(false);
      setIsUserStoreLoading(false);
      setIsListProposalsLoading(false);
    }
  }

  async function fetchV1ContestInfo(contractConfig: ContractConfig) {
    try {
      const contracts = getV1Contracts(contractConfig);
      const results = await readContracts({ contracts });

      setIsV3(false);

      // List of proposals for this contest
      await fetchProposalsIdsList(contractConfig.contractInterface);

      setContestName(results[0].toString());
      setContestAuthor(results[1].toString(), results[1].toString());
      //@ts-ignore
      setContestMaxNumberSubmissionsPerUser(results[2]);
      //@ts-ignore
      setContestMaxProposalCount(results[3]);

      //@ts-ignore
      const closingVoteDate = new Date(parseInt(results[6]) * 1000);

      //@ts-ignore
      setSubmissionsOpen(new Date(parseInt(results[5]) * 1000));
      //@ts-ignore
      setVotesOpen(new Date(parseInt(results[7]) * 1000));
      setVotesClose(closingVoteDate);

      setError(null);
      setIsSuccess(true);
      setIsLoading(false);
      setIsListProposalsLoading(false);

      //@ts-ignore
      const promptFilter = contractConfig.contractInterface?.filter(el => el.name === "prompt");
      //@ts-ignore
      const submissionGatingFilter = contractConfig.contractInterface?.filter(
        (el: { name: string }) => el.name === "submissionGatingByVotingToken",
      );
      //@ts-ignore
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

  /**
   * Fetch contest data from the contract, depending on the version of the contract
   */
  async function fetchContestInfo() {
    setIsLoading(true);
    setIsUserStoreLoading(true);
    const result = await getContractConfig();

    if (!result) {
      setIsLoading(false);
      setIsUserStoreLoading(false);
      return;
    }

    const { contractConfig, version } = result;

    let contestRewardModuleAddress: string | undefined;

    if (
      contractConfig.contractInterface?.filter((el: { name: string }) => el.name === "officialRewardsModule").length > 0
    ) {
      contestRewardModuleAddress = await readContract({
        ...contractConfig,
        functionName: "officialRewardsModule",
      });
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
      await fetchV3ContestInfo(contractConfig, contestRewardModuleAddress);
    } else {
      await fetchV1ContestInfo(contractConfig);
    }
  }

  /**
   * Fetch merkle tree data from DB and re-create the tree
   */
  async function processContestData(submissionMerkleRoot: string, contestMaxNumberSubmissionsPerUser: number) {
    if (!isSupabaseConfigured) {
      setIsReadOnly(true);
      if (submissionMerkleRoot === EMPTY_ROOT) {
        await checkIfCurrentUserQualifyToSubmit(submissionMerkleRoot, contestMaxNumberSubmissionsPerUser);
        setIsUserStoreLoading(false);
        return;
      } else {
        setIsUserStoreLoading(false);
        return;
      }
    }

    try {
      const { data } = await supabase
        .from("contests_v3")
        .select("submissionMerkleTree, votingMerkleTree")
        .eq("address", address)
        .eq("network_name", chainName);

      if (data && data.length === 0) {
        toastError("we couldn't find given contest in db!");
        setIsReadOnly(true);
        if (submissionMerkleRoot === EMPTY_ROOT) {
          await checkIfCurrentUserQualifyToSubmit(submissionMerkleRoot, contestMaxNumberSubmissionsPerUser);
        }
        setIsUserStoreLoading(false);
        return;
      }

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

        if (submissionMerkleRoot === EMPTY_ROOT) {
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
        await checkIfCurrentUserQualifyToSubmit(submissionMerkleRoot, contestMaxNumberSubmissionsPerUser);
        await checkIfCurrentUserQualifyToVote();

        setIsUserStoreLoading(false);
        setSubmissionMerkleTree(submissionMerkleTree);
        setVotingMerkleTree(votingMerkleTree);
      } else {
        setIsUserStoreLoading(false);
      }
    } catch (error) {
      const customError = error as CustomError;
      toastError("error while fetching data from db", customError.message);
      setIsUserStoreLoading(false);
    }
  }

  /**
   * Fetch reward data from the rewards module contract
   * @param contestRewardModuleAddress
   * @returns
   */
  async function processRewardData(contestRewardModuleAddress: string | undefined) {
    if (!contestRewardModuleAddress) return;

    const abiRewardsModule = await getRewardsModuleContractVersion(contestRewardModuleAddress, chainName);

    if (!abiRewardsModule) {
      setRewards(null);
    } else {
      const winners = await readContract({
        addressOrName: contestRewardModuleAddress,
        contractInterface: abiRewardsModule,
        chainId: chainId,
        functionName: "getPayees",
      });

      let rewardToken: FetchBalanceResult | null = null;
      let erc20Tokens: any = null;

      rewardToken = await fetchNativeBalance(contestRewardModuleAddress, chainId);

      if (!rewardToken || rewardToken.value.eq(0)) {
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

  async function fetchTotalVotesCast() {
    try {
      const result = await getContractConfig();
      if (!result) return;

      const { contractConfig } = result;

      if (
        !(contractConfig.contractInterface?.filter((el: { name: string }) => el.name === "totalVotesCast").length > 0)
      ) {
        setTotalVotesCast(-1);
        return;
      }

      const totalVotesCast = await readContract({
        ...contractConfig,
        functionName: "totalVotesCast",
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
