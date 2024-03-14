/* eslint-disable react-hooks/exhaustive-deps */
import { supabase } from "@config/supabase";
import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { getGasPrice, readContract, readContracts } from "@wagmi/core";
import { compareVersions } from "compare-versions";
import { BigNumber, utils } from "ethers";
import { fetchUserBalance } from "lib/fetchUserBalance";
import { useRouter } from "next/router";
import { Abi } from "viem";
import { useAccount } from "wagmi";
import { useUserStore } from "./store";

export const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";
const ANYONE_CAN_VOTE_VERSION = "4.27";

export function useUser() {
  const { setVotingMerkleRoot, setSubmissionsMerkleRoot, setAnyoneCanVote } = useContestStore(state => state);
  const { asPath } = useRouter();
  const { chainName, address } = extractPathSegments(asPath);
  const lowerCaseChainName = chainName.replace(/\s+/g, "").toLowerCase();
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
    if (!userAddress) return;
    setIsCurrentUserSubmitQualificationLoading(true);

    const { abi } = await getContestContractVersion(address, chainId);

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

    if (anyoneCanSubmit) {
      try {
        const numOfSubmittedProposalsRaw = await readContract(config, {
          ...contractConfig,
          functionName: "numSubmissions",
          args: [userAddress],
        });

        const numOfSubmittedProposals = BigNumber.from(numOfSubmittedProposalsRaw);

        if (numOfSubmittedProposals.gt(0) && numOfSubmittedProposals.gte(contestMaxNumberSubmissionsPerUser)) {
          setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
          setIsCurrentUserSubmitQualificationLoading(false);
          setIsCurrentUserSubmitQualificationSuccess(true);
          return;
        }

        setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
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
          .eq("contest_address", address)
          .eq("network_name", lowerCaseChainName);

        if (data && data.length > 0 && data[0].can_submit) {
          const numOfSubmittedProposalsRaw = await readContract(config, {
            ...contractConfig,
            functionName: "numSubmissions",
            args: [userAddress],
          });

          const numOfSubmittedProposals = BigNumber.from(numOfSubmittedProposalsRaw);

          if (numOfSubmittedProposals.gt(0) && numOfSubmittedProposals.gte(contestMaxNumberSubmissionsPerUser)) {
            setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
            setIsCurrentUserSubmitQualificationLoading(false);
            setIsCurrentUserSubmitQualificationSuccess(true);
            return;
          }

          setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
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
    if (!userAddress) return;

    setIsCurrentUserVoteQualificationLoading(true);

    const { abi, version } = await getContestContractVersion(address, chainId);

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
        .eq("contest_address", address)
        .eq("network_name", lowerCaseChainName);

      if (data && data.length > 0 && data[0].num_votes > 0) {
        const abi = await getContestContractVersion(address, chainId);
        if (!abi) return;

        const contractConfig = {
          address: address as `0x${string}`,
          abi: abi.abi as Abi,
          chainId: chainId,
        };

        const currentUserTotalVotesCast = await readContract(config, {
          ...contractConfig,
          functionName: "contestAddressTotalVotesCast",
          args: [userAddress],
        });

        const userVotes = data[0].num_votes;

        //@ts-ignore
        const castVotes = BigNumber.from(currentUserTotalVotesCast) / 1e18;

        if (castVotes > 0) {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(userVotes - castVotes);
          setCurrentuserTotalVotesCast(castVotes);
          setIsCurrentUserVoteQualificationSuccess(true);
          setIsCurrentUserVoteQualificationLoading(false);
        } else {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(userVotes);
          setCurrentuserTotalVotesCast(castVotes);
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
      const { abi } = await getContestContractVersion(address, chainId);

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
        }) as any,
      ]);

      const costToVoteBigNum = BigNumber.from(Number(costToVote));
      const userBalanceBigNum = BigNumber.from(userBalance.value);
      const currentGasPriceBigNum = BigNumber.from(gasPrice);

      const totalCostBigNum = costToVoteBigNum.add(currentGasPriceBigNum);

      const userVotesRaw = userBalanceBigNum.div(totalCostBigNum);

      const userVotesFormatted = Number(utils.parseEther(userVotesRaw.toString())) / 1e18;

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
      const currentUserTotalVotesCastRaw = await readContract(config, {
        address: address as `0x${string}`,
        abi: abi as Abi,
        functionName: "contestAddressTotalVotesCast",
        args: [userAddress],
      });

      const currentUserTotalVotesCast = BigNumber.from(currentUserTotalVotesCastRaw);

      //@ts-ignore
      setCurrentUserAvailableVotesAmount(currentUserTotalVotesAmount - currentUserTotalVotesCast / 1e18);
      //@ts-ignore
      setCurrentuserTotalVotesCast(currentUserTotalVotesCast / 1e18);
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
