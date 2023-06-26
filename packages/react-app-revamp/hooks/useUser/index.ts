import { supabase } from "@config/supabase";
import { chains } from "@config/wagmi";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { fetchBlockNumber, getAccount, readContract, readContracts } from "@wagmi/core";
import { isFuture } from "date-fns";
import { generateProof } from "lib/merkletree/generateSubmissionsTree";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { CustomError } from "types/error";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { useUserStore } from "./store";

const EMPTY_ROOT = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function useUser() {
  const provider = useProvider();
  const { address: userAddress } = useAccount();
  const { setCurrentUserQualifiedToSubmit, setCurrentUserTotalVotesCast, setCurrentUserAvailableVotesAmount } =
    useUserStore(state => state);
  const { setIsListProposalsSuccess, setIsListProposalsLoading } = useProposalStore(state => state);
  const {
    submissionMerkleTree,
    votingMerkleTree,
    setIsSuccess: setIsContestSuccess,
    setIsLoading: setIsContestLoading,
    setSnapshotTaken,
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

    if (submissionMerkleTree.getHexRoot() === EMPTY_ROOT) {
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
      setCurrentUserAvailableVotesAmount(data[0].num_votes);
    } else {
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
      // get current block number
      const currentBlockNumber = await fetchBlockNumber();
      const timestamp = (await provider.getBlock(currentBlockNumber)).timestamp - 50; // (necessary to avoid block not mined error)
      const contracts = [
        // get current user availables votes now
        {
          ...contractConfig,
          functionName: "getVotes",
          args: [accountData?.address, timestamp],
        },
        // get votes cast by current user
        {
          ...contractConfig,
          functionName: "contestAddressTotalVotesCast",
          args: accountData?.address,
        },
      ];

      const results = await readContracts({ contracts });
      const currentUserAvailableVotesAmount = results[0];
      const currentUserTotalVotesCast = results[1];
      //@ts-ignore
      setCurrentUserTotalVotesCast(currentUserTotalVotesCast / 1e18);
      //@ts-ignore
      setCurrentUserAvailableVotesAmount(currentUserAvailableVotesAmount / 1e18 - currentUserTotalVotesCast / 1e18);
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
