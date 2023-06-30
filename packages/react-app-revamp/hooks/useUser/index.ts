import { supabase } from "@config/supabase";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { fetchBlockNumber, getAccount, readContract, readContracts } from "@wagmi/core";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { useUserStore } from "./store";

const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useUser() {
  const provider = useProvider();
  const { address: userAddress } = useAccount();
  const {
    setCurrentUserQualifiedToSubmit,
    setCurrentUserAvailableVotesAmount,
    setCurrentUserTotalVotesAmount,
    currentUserTotalVotesAmount,
  } = useUserStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading } = useProposalStore(state => state);
  const {
    submissionMerkleTree,
    votingMerkleTree,
    setIsSuccess: setIsContestSuccess,
    setIsLoading: setIsContestLoading,
    setError: setContestError,
  } = useContestStore(state => state);
  const { chain } = useNetwork();
  const { asPath } = useRouter();
  const [chainName, address] = asPath.split("/").slice(2, 4);

  /**
   * Display an error toast in the UI for any contract related error
   */
  function onContractError(err: any) {
    let toastMessage = err?.message ?? err;
    if (err.code === "CALL_EXCEPTION") toastMessage = `This contract doesn't exist on ${chain?.name ?? "this chain"}.`;
    toast.error(toastMessage);
  }

  // Generate config for the contract
  async function getContractConfig() {
    const { abi } = await getContestContractVersion(address, chainName);

    if (abi === null) {
      toast.error(`This contract doesn't exist on ${chain?.name ?? "this chain"}.`);
      setContestError({ message: `This contract doesn't exist on ${chain?.name ?? "this chain"}.` });
      setIsContestSuccess(false);
      setIsListProposalsSuccess(false);
      setIsListProposalsLoading(false);
      setIsContestLoading(false);
      return;
    }

    const contractConfig = {
      addressOrName: address,
      contractInterface: abi,
      chainId: chains.find(
        c => c.name.replace(/\s+/g, "").toLowerCase() === chainName.replace(/\s+/g, "").toLowerCase(),
      )?.id,
    };

    return contractConfig;
  }

  const checkIfCurrentUserQualifyToSubmit = async () => {
    if (!userAddress) return;

    if (submissionMerkleTree.getHexRoot() === "0x") {
      setCurrentUserQualifiedToSubmit(true);
    } else {
      // Perform a lookup in the 'contest_participants_v3' table.
      const { data, error } = await supabase
        .from("contest_participants_v3")
        .select("can_submit")
        .eq("user_address", userAddress)
        .eq("contest_address", address);

      if (error) {
        console.error("Error performing lookup in 'contest_participants_v3':", error);
        return;
      }

      // If the current user can submit, set 'currentUserQualifiedToSubmit' to true.
      if (data && data.length > 0 && data[0].can_submit) {
        setCurrentUserQualifiedToSubmit(true);
      } else {
        setCurrentUserQualifiedToSubmit(false);
      }
    }
  };

  /**
   * Check if the current user qualify to vote for this contest
   */
  async function checkIfCurrentUserQualifyToVote() {
    if (!userAddress) return;

    // Perform a lookup in the 'contest_participants_v3' table.
    const { data, error } = await supabase
      .from("contest_participants_v3")
      .select("num_votes")
      .eq("user_address", userAddress)
      .eq("contest_address", address);

    if (error) {
      console.error("Error performing lookup in 'contest_participants_v3':", error);
      return;
    }

    // If the current user can vote, set 'currentUserQualifiedToSubmit' to true.
    if (data && data.length > 0 && data[0].num_votes > 0) {
      const contractConfig = await getContractConfig();
      if (!contractConfig) return;

      const currentUserTotalVotesCast = await readContract({
        ...contractConfig,
        functionName: "contestAddressTotalVotesCast",
        args: userAddress,
      });

      const userVotes = data[0].num_votes;
      //@ts-ignore
      const castVotes = currentUserTotalVotesCast / 1e18;

      if (castVotes > 0) {
        setCurrentUserTotalVotesAmount(userVotes);
        setCurrentUserAvailableVotesAmount(userVotes - castVotes);
      } else {
        setCurrentUserTotalVotesAmount(userVotes);
        setCurrentUserAvailableVotesAmount(userVotes);
      }
    } else {
      setCurrentUserTotalVotesAmount(0);
      setCurrentUserAvailableVotesAmount(0);
    }
  }

  /**
   * Update the amount of votes casted in this contest by the current user
   */
  async function updateCurrentUserVotes() {
    const contractConfig = await getContractConfig();

    if (!contractConfig) return;
    const accountData = getAccount();

    try {
      const currentUserTotalVotesCast = await readContract({
        ...contractConfig,
        functionName: "contestAddressTotalVotesCast",
        args: accountData?.address,
      });

      //@ts-ignore
      setCurrentUserAvailableVotesAmount(currentUserTotalVotesAmount - currentUserTotalVotesCast / 1e18);
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
