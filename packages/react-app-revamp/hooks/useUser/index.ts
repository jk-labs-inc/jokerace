import { toastError } from "@components/UI/Toast";
import { supabase } from "@config/supabase";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { getAccount, readContract } from "@wagmi/core";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { Abi } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { useUserStore } from "./store";

export const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useUser() {
  const { address: userAddress } = useAccount();
  const {
    setCurrentUserQualifiedToSubmit,
    setCurrentUserAvailableVotesAmount,
    setCurrentUserTotalVotesAmount,
    setCurrentUserProposalCount,
    setCurrentuserTotalVotesCast,
    currentUserTotalVotesAmount,
  } = useUserStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading } = useProposalStore(state => state);
  const {
    setIsSuccess: setIsContestSuccess,
    setIsLoading: setIsContestLoading,
    setError: setContestError,
  } = useContestStore(state => state);
  const { chain } = useNetwork();
  const { asPath } = useRouter();
  const [chainName, address] = asPath.split("/").slice(2, 4);
  const lowerCaseChainName = chainName.replace(/\s+/g, "").toLowerCase();
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === lowerCaseChainName)?.[0]?.id;

  // Generate config for the contract
  async function getContractConfig() {
    const { abi } = await getContestContractVersion(address, chainId);

    if (abi === null) {
      toastError(`This contract doesn't exist on ${chain?.name ?? "this chain"}.`);
      setContestError({ message: `This contract doesn't exist on ${chain?.name ?? "this chain"}.` });
      setIsContestSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsContestLoading(false);
      return;
    }

    return { abi };
  }

  const checkIfCurrentUserQualifyToSubmit = async (
    submissionMerkleRoot: string,
    contestMaxNumberSubmissionsPerUser: number,
  ) => {
    const abi = await getContractConfig();

    if (!userAddress || !abi) return;

    const contractConfig = {
      address: address as `0x${string}`,
      abi: abi.abi as any,
      chainId: chainId,
    };

    if (submissionMerkleRoot === EMPTY_ROOT) {
      const numOfSubmittedProposalsRaw = await readContract({
        ...contractConfig,
        functionName: "getNumSubmissions",
        args: [userAddress],
      });

      const numOfSubmittedProposals = BigNumber.from(numOfSubmittedProposalsRaw);

      if (numOfSubmittedProposals.gt(0) && numOfSubmittedProposals.gte(contestMaxNumberSubmissionsPerUser)) {
        setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
        return;
      }

      setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
      setCurrentUserQualifiedToSubmit(true);
    } else {
      const config = await import("@config/supabase");
      const supabase = config.supabase;
      try {
        const { data } = await supabase
          .from("contest_participants_v3")
          .select("can_submit")
          .eq("user_address", userAddress)
          .eq("contest_address", address)
          .eq("network_name", lowerCaseChainName);

        if (data && data.length > 0 && data[0].can_submit) {
          const numOfSubmittedProposalsRaw = await readContract({
            ...contractConfig,
            functionName: "getNumSubmissions",
            args: [userAddress],
          });

          const numOfSubmittedProposals = BigNumber.from(numOfSubmittedProposalsRaw);

          if (numOfSubmittedProposals.gt(0) && numOfSubmittedProposals.gte(contestMaxNumberSubmissionsPerUser)) {
            setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
            return;
          }

          setCurrentUserProposalCount(numOfSubmittedProposals.toNumber());
          setCurrentUserQualifiedToSubmit(true);
        } else {
          setCurrentUserQualifiedToSubmit(false);
        }
      } catch (error) {
        console.error("Error performing lookup in 'contest_participants_v3':", error);
        setCurrentUserQualifiedToSubmit(false);
      }
    }
  };

  /**
   * Check if the current user qualify to vote for this contest
   */
  async function checkIfCurrentUserQualifyToVote() {
    if (!userAddress) return;

    try {
      // Perform a lookup in the 'contest_participants_v3' table.
      const { data } = await supabase
        .from("contest_participants_v3")
        .select("num_votes")
        .eq("user_address", userAddress)
        .eq("contest_address", address)
        .eq("network_name", lowerCaseChainName);

      if (data && data.length > 0 && data[0].num_votes > 0) {
        const abi = await getContractConfig();
        if (!abi) return;

        const contractConfig = {
          address: address as `0x${string}`,
          abi: abi.abi as unknown as Abi,
          chainId: chainId,
        };

        const currentUserTotalVotesCast = await readContract({
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
        } else {
          setCurrentUserTotalVotesAmount(userVotes);
          setCurrentUserAvailableVotesAmount(userVotes);
          setCurrentuserTotalVotesCast(castVotes);
        }
      } else {
        setCurrentUserTotalVotesAmount(0);
        setCurrentUserAvailableVotesAmount(0);
        setCurrentuserTotalVotesCast(0);
      }
    } catch (error) {
      console.error("Error performing lookup in 'contest_participants_v3':", error);
      setCurrentUserTotalVotesAmount(0);
      setCurrentUserAvailableVotesAmount(0);
      setCurrentuserTotalVotesCast(0);
    }
  }

  /**
   * Update the amount of votes casted in this contest by the current user
   */
  async function updateCurrentUserVotes() {
    const abi = await getContractConfig();

    if (!abi) return;
    const accountData = getAccount();

    try {
      const currentUserTotalVotesCastRaw = await readContract({
        address: address as `0x${string}`,
        abi: abi.abi as unknown as Abi,
        functionName: "contestAddressTotalVotesCast",
        args: [accountData?.address],
      });

      const currentUserTotalVotesCast = BigNumber.from(currentUserTotalVotesCastRaw);

      //@ts-ignore
      setCurrentUserAvailableVotesAmount(currentUserTotalVotesAmount - currentUserTotalVotesCast / 1e18);
      //@ts-ignore
      setCurrentuserTotalVotesCast(currentUserTotalVotesCast / 1e18);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    checkIfCurrentUserQualifyToVote,
    checkIfCurrentUserQualifyToSubmit,
    updateCurrentUserVotes,
  };
}

export default useUser;
