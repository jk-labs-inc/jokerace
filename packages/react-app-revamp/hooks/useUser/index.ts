import { supabase } from "@config/supabase";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { ContractConfig } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { getGasPrice, readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { fetchUserBalance } from "lib/fetchUserBalance";
import { usePathname } from "next/navigation";
import { Abi, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useUserStore } from "./store";

export const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

const STANDARD_ANYONE_CAN_VOTE_GAS_LIMIT = 5000000;
const ANYONE_CAN_VOTE_VERSION = "4.27";

export function useUser() {
  const { setVotingMerkleRoot, setSubmissionsMerkleRoot, setAnyoneCanVote } = useContestStore(state => state);
  const asPath = usePathname();
  const { chainName, address } = extractPathSegments(asPath ?? "");
  const lowerCaseChainName = chainName.replace(/\s+/g, "").toLowerCase();
  const contestAddressLowerCase = address.toLowerCase();
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === lowerCaseChainName,
  )?.[0]?.id;
  const { address: userAddress } = useAccount();

  const {
    setCurrentUserQualifiedToSubmit,
    setCurrentUserAvailableVotesAmount,
    setCurrentUserTotalVotesAmount,
    setCurrentUserProposalCount,
    setCurrentuserTotalVotesCast,
    currentUserTotalVotesAmount,
    setIsCurrentUserSubmitQualificationLoading,
    setIsCurrentUserSubmitQualificationSuccess,
    setIsCurrentUserSubmitQualificationError,
    setIsCurrentUserVoteQualificationLoading,
    setIsCurrentUserVoteQualificationSuccess,
    setIsCurrentUserVoteQualificationError,
  } = useUserStore(state => state);

  const checkIfCurrentUserQualifyToSubmit = async (contractConfig: ContractConfig, version: string) => {
    setIsCurrentUserSubmitQualificationLoading(true);

    if (compareVersions(version, "3.0") == -1) {
      setIsCurrentUserSubmitQualificationLoading(false);
      return;
    }

    if (!contractConfig.abi) {
      setIsCurrentUserSubmitQualificationError(true);
      setIsCurrentUserSubmitQualificationLoading(false);
      return;
    }

    const results = await readContracts(config, {
      contracts: [
        {
          ...contractConfig,
          functionName: "submissionMerkleRoot",
          args: [],
        },
        {
          ...contractConfig,
          functionName: "numAllowedProposalSubmissions",
          args: [],
        },
      ],
    });

    const submissionMerkleRoot = results[0].result as string;
    const contestMaxNumberSubmissionsPerUser = Number(results[1].result);

    const anyoneCanSubmit = submissionMerkleRoot === EMPTY_ROOT;

    setSubmissionsMerkleRoot(submissionMerkleRoot);

    if (!userAddress) return;

    if (anyoneCanSubmit) {
      try {
        const numOfSubmittedProposalsRaw = (await readContract(config, {
          ...contractConfig,
          functionName: "numSubmissions",
          args: [userAddress],
        })) as bigint;

        if (numOfSubmittedProposalsRaw > 0 && numOfSubmittedProposalsRaw >= contestMaxNumberSubmissionsPerUser) {
          setCurrentUserProposalCount(Number(numOfSubmittedProposalsRaw.toString()));
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
          return;
        }

        setCurrentUserProposalCount(Number(numOfSubmittedProposalsRaw.toString()));
        setCurrentUserQualifiedToSubmit(true);
        setIsCurrentUserSubmitQualificationLoading(false);
        setIsCurrentUserSubmitQualificationSuccess(true);
      } catch (error) {
        setIsCurrentUserSubmitQualificationError(true);
        setCurrentUserQualifiedToSubmit(false);
        setIsCurrentUserSubmitQualificationLoading(false);
        setIsCurrentUserSubmitQualificationSuccess(false);
      }
    } else {
      const supabaseConfig = await import("@config/supabase");
      const supabase = supabaseConfig.supabase;
      try {
        const { data } = await supabase
          .from("contest_participants_v3")
          .select("can_submit")
          .eq("user_address", userAddress)
          .eq("contest_address", contestAddressLowerCase)
          .eq("network_name", lowerCaseChainName);

        if (data && data.length > 0 && data[0].can_submit) {
          const numOfSubmittedProposalsRaw = (await readContract(config, {
            ...contractConfig,
            functionName: "numSubmissions",
            args: [userAddress],
          })) as bigint;

          if (numOfSubmittedProposalsRaw > 0 && numOfSubmittedProposalsRaw >= contestMaxNumberSubmissionsPerUser) {
            setCurrentUserProposalCount(Number(numOfSubmittedProposalsRaw.toString()));
            setIsCurrentUserSubmitQualificationLoading(false);
            setIsCurrentUserSubmitQualificationSuccess(true);
            return;
          }

          setCurrentUserProposalCount(Number(numOfSubmittedProposalsRaw.toString()));

          setCurrentUserQualifiedToSubmit(true);
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
        } else {
          setCurrentUserQualifiedToSubmit(false);
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
        }
      } catch (error) {
        console.error("Error performing lookup in 'contest_participants_v3':", error);
        setIsCurrentUserSubmitQualificationError(true);
        setCurrentUserQualifiedToSubmit(false);
        setIsCurrentUserSubmitQualificationLoading(false);
        setIsCurrentUserSubmitQualificationSuccess(false);
      }
    }
  };

  /**
   * Check if the current user qualify to vote for this contest
   */
  async function checkIfCurrentUserQualifyToVote(contractConfig: ContractConfig, version: string) {
    setIsCurrentUserVoteQualificationLoading(true);
    if (compareVersions(version, "3.0") == -1) {
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    if (!contractConfig.abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    const votingMerkleRoot = (await readContract(config, {
      address: address as `0x${string}`,
      abi: contractConfig.abi as Abi,
      chainId: chainId,
      functionName: "votingMerkleRoot",
    })) as string;

    const anyoneCanVote = votingMerkleRoot === EMPTY_ROOT;
    setVotingMerkleRoot(votingMerkleRoot);
    setAnyoneCanVote(anyoneCanVote);

    if (!userAddress) return;

    if (compareVersions(version, ANYONE_CAN_VOTE_VERSION) >= 0) {
      if (anyoneCanVote) {
        await checkAnyoneCanVoteUserQualification(contractConfig.abi, version);
        return;
      }
    }

    try {
      // Perform a lookup in the 'contest_participants_v3' table.
      const { data } = await supabase
        .from("contest_participants_v3")
        .select("num_votes")
        .eq("user_address", userAddress)
        .eq("contest_address", contestAddressLowerCase)
        .eq("network_name", lowerCaseChainName);

      if (data && data.length > 0 && data[0].num_votes > 0) {
        const currentUserTotalVotesCast = (await readContract(config, {
          ...contractConfig,
          functionName: "contestAddressTotalVotesCast",
          args: [userAddress],
        })) as bigint;

        const userVotes = data[0].num_votes;

        const availableVotes = BigInt(userVotes) - currentUserTotalVotesCast / BigInt(1e18);

        if (currentUserTotalVotesCast > 0) {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(Number(availableVotes));
          setCurrentuserTotalVotesCast(Number(currentUserTotalVotesCast));
          setIsCurrentUserVoteQualificationSuccess(true);
          setIsCurrentUserVoteQualificationLoading(false);
        } else {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(userVotes);
          setCurrentuserTotalVotesCast(Number(currentUserTotalVotesCast));
          setIsCurrentUserVoteQualificationSuccess(true);
          setIsCurrentUserVoteQualificationLoading(false);
        }
      } else {
        setCurrentUserTotalVotesAmount(0);
        setCurrentUserAvailableVotesAmount(0);
        setCurrentuserTotalVotesCast(0);
        setIsCurrentUserVoteQualificationSuccess(true);
        setIsCurrentUserVoteQualificationLoading(false);
      }
    } catch (error) {
      console.error("Error performing lookup in 'contest_participants_v3':", error);
      setCurrentUserTotalVotesAmount(0);
      setCurrentUserAvailableVotesAmount(0);
      setCurrentuserTotalVotesCast(0);
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationLoading(false);
      setIsCurrentUserVoteQualificationSuccess(false);
    }
  }

  async function checkAnyoneCanVoteUserQualification(abi: any, version: string) {
    if (!userAddress) return;

    try {
      if (compareVersions(version, ANYONE_CAN_VOTE_VERSION) < 0 || !abi) {
        setIsCurrentUserVoteQualificationSuccess(false);
        setIsCurrentUserVoteQualificationLoading(false);
        setIsCurrentUserVoteQualificationError(!abi);
        return;
      }

      const [userBalanceResult, gasPriceResult, costToVoteResult] = await Promise.all([
        fetchUserBalance(userAddress, chainId).catch(error => {
          return { value: 0n };
        }),
        getGasPrice(config, { chainId }).catch(error => {
          return 0n;
        }),
        readContract(config, {
          address: address as `0x${string}`,
          abi: abi as Abi,
          chainId: chainId,
          functionName: "costToVote",
        }).catch(error => {
          return 0n;
        }) as Promise<bigint>,
      ]);

      // safety check for valid BigInt values
      if (!userBalanceResult.value || !gasPriceResult || !costToVoteResult) {
        setUserVoteQualification(0, 0, true, false, false);
        return;
      }

      if (userBalanceResult.value === 0n) {
        setUserVoteQualification(0, 0, true, false, false);
        return;
      }

      const totalGasCost = gasPriceResult * BigInt(STANDARD_ANYONE_CAN_VOTE_GAS_LIMIT);

      // prevent negative values
      if (userBalanceResult.value <= totalGasCost || costToVoteResult === 0n) {
        setUserVoteQualification(0, 0, true, false, false);
        return;
      }

      const userVotesRaw = (userBalanceResult.value - totalGasCost) / costToVoteResult;

      const userVotesFormatted = Math.floor(Number(parseEther(userVotesRaw.toString())) / 1e18);

      // check for valid number
      if (isNaN(userVotesFormatted)) {
        setUserVoteQualification(0, 0, false, false, true);
        return;
      }

      setUserVoteQualification(userVotesFormatted, userVotesFormatted, true, false, false);
    } catch (error) {
      console.error("error in checkAnyoneCanVoteUserQualification:", error);
      setUserVoteQualification(0, 0, false, false, true);
    }
  }
  /**
   * Update the amount of votes casted in this contest by the current user
   */
  async function updateCurrentUserVotes(abi: any, version: string, anyoneCanVote?: boolean) {
    setIsCurrentUserVoteQualificationLoading(true);

    if (!abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    if (anyoneCanVote) {
      await checkAnyoneCanVoteUserQualification(abi, version);
      return;
    }

    try {
      const currentUserTotalVotesCastRaw = (await readContract(config, {
        address: address as `0x${string}`,
        abi: abi as Abi,
        functionName: "contestAddressTotalVotesCast",
        args: [userAddress],
      })) as bigint;

      const currentUserAvailableVotesAmountRaw =
        BigInt(currentUserTotalVotesAmount) - currentUserTotalVotesCastRaw / BigInt(1e18);
      const currentUserTotalVotesCastFinalRaw = currentUserTotalVotesCastRaw / BigInt(1e18);

      setCurrentUserAvailableVotesAmount(Number(currentUserAvailableVotesAmountRaw));
      setCurrentuserTotalVotesCast(Number(currentUserTotalVotesCastFinalRaw));
      setIsCurrentUserVoteQualificationSuccess(true);
      setIsCurrentUserVoteQualificationLoading(false);
    } catch (e) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
    }
  }

  // helper function to set multiple state values
  function setUserVoteQualification(
    totalVotes: number,
    availableVotes: number,
    success: boolean,
    loading: boolean,
    error: boolean,
  ) {
    setCurrentUserTotalVotesAmount(totalVotes);
    setCurrentUserAvailableVotesAmount(availableVotes);
    setIsCurrentUserVoteQualificationSuccess(success);
    setIsCurrentUserVoteQualificationLoading(loading);
    setIsCurrentUserVoteQualificationError(error);
  }

  return {
    checkIfCurrentUserQualifyToVote,
    checkIfCurrentUserQualifyToSubmit,
    updateCurrentUserVotes,
  };
}

export default useUser;
