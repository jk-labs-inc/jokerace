/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "@config/supabase";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { getGasPrice, readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { fetchUserBalance } from "lib/fetchUserBalance";
import { usePathname } from "next/navigation";
import { Abi, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useUserStore } from "./store";

export const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";
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

  const checkIfCurrentUserQualifyToSubmit = async () => {
    setIsCurrentUserSubmitQualificationLoading(true);

    const { abi, version } = await getContestContractVersion(address, chainId);

    if (compareVersions(version, "3.0") == -1) {
      setIsCurrentUserSubmitQualificationLoading(false);
      return;
    }

    if (!abi) {
      setIsCurrentUserSubmitQualificationError(true);
      setIsCurrentUserSubmitQualificationLoading(false);
      return;
    }

    const contractConfig = {
      address: address as `0x${string}`,
      abi: abi as Abi,
      chainId: chainId,
    };

    const results = await readContracts(config, {
      contracts: [
        {
          ...contractConfig,
          functionName: "submissionMerkleRoot",
        },
        {
          ...contractConfig,
          functionName: "numAllowedProposalSubmissions",
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
  async function checkIfCurrentUserQualifyToVote() {
    setIsCurrentUserVoteQualificationLoading(true);

    const { abi, version } = await getContestContractVersion(address, chainId);

    if (compareVersions(version, "3.0") == -1) {
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    if (!abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    const votingMerkleRoot = (await readContract(config, {
      address: address as `0x${string}`,
      abi: abi as Abi,
      chainId: chainId,
      functionName: "votingMerkleRoot",
    })) as string;

    const anyoneCanVote = votingMerkleRoot === EMPTY_ROOT;
    setVotingMerkleRoot(votingMerkleRoot);
    setAnyoneCanVote(anyoneCanVote);

    if (!userAddress) return;

    if (compareVersions(version, ANYONE_CAN_VOTE_VERSION) >= 0) {
      if (anyoneCanVote) {
        await checkAnyoneCanVoteUserQualification();
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
        const abi = await getContestContractVersion(address, chainId);
        if (!abi) return;

        const contractConfig = {
          address: address as `0x${string}`,
          abi: abi.abi as Abi,
          chainId: chainId,
        };

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

  async function checkAnyoneCanVoteUserQualification() {
    if (!userAddress) return;

    try {
      const { abi, version } = await getContestContractVersion(address, chainId);

      if (compareVersions(version, ANYONE_CAN_VOTE_VERSION) == -1) {
        setIsCurrentUserVoteQualificationSuccess(false);
        setIsCurrentUserVoteQualificationLoading(false);
        return;
      }

      if (!abi) {
        setIsCurrentUserVoteQualificationError(true);
        setIsCurrentUserVoteQualificationSuccess(false);
        setIsCurrentUserVoteQualificationLoading(false);
        return;
      }

      const [userBalance, gasPrice, costToVote] = await Promise.all([
        fetchUserBalance(userAddress, chainId),
        getGasPrice(config, { chainId }),
        readContract(config, {
          address: address as `0x${string}`,
          abi: abi,
          chainId: chainId,
          functionName: "costToVote",
        }) as unknown as bigint,
      ]);

      const totalCost = costToVote + gasPrice;

      const userVotesRaw = userBalance.value / totalCost;

      const userVotesFormatted = Number(parseEther(userVotesRaw.toString())) / 1e18;

      setCurrentUserTotalVotesAmount(userVotesFormatted);
      setCurrentUserAvailableVotesAmount(userVotesFormatted);

      setIsCurrentUserVoteQualificationSuccess(true);
      setIsCurrentUserVoteQualificationLoading(false);
      setIsCurrentUserVoteQualificationError(false);
    } catch (error) {
      console.error("Error in checkAnyoneCanVoteUserQualification:", error);
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
    }
  }

  /**
   * Update the amount of votes casted in this contest by the current user
   */
  async function updateCurrentUserVotes(anyoneCanVote?: boolean) {
    setIsCurrentUserVoteQualificationLoading(true);

    const { abi } = await getContestContractVersion(address, chainId);
    if (!abi) {
      setIsCurrentUserVoteQualificationError(true);
      setIsCurrentUserVoteQualificationSuccess(false);
      setIsCurrentUserVoteQualificationLoading(false);
      return;
    }

    if (anyoneCanVote) {
      await checkAnyoneCanVoteUserQualification();
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

  return {
    checkIfCurrentUserQualifyToVote,
    checkIfCurrentUserQualifyToSubmit,
    updateCurrentUserVotes,
  };
}

export default useUser;
