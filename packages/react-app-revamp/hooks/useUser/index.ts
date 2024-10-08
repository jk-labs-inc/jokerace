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
      try {
        const params = new URLSearchParams({
          userAddress,
          contestAddress: contestAddressLowerCase,
          chainName: lowerCaseChainName,
        });

        const response = await fetch(`/api/user/allowed-to-submit?${params}`);

        if (!response.ok) {
          throw new Error("Failed to check if user is allowed to submit");
        }

        const { data } = await response.json();

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
      const params = new URLSearchParams({
        userAddress,
        contestAddress: contestAddressLowerCase,
        chainName: lowerCaseChainName,
      });

      const response = await fetch(`/api/user/allowed-to-vote?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user vote info");
      }

      const { data } = await response.json();

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
      console.error("Error fetching user vote info:", error);
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
          abi: abi as Abi,
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

  return {
    checkIfCurrentUserQualifyToVote,
    checkIfCurrentUserQualifyToSubmit,
    updateCurrentUserVotes,
  };
}

export default useUser;
