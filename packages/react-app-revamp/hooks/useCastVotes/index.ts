import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains, config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { useGenerateProof } from "@hooks/useGenerateProof";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { readContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useCastVotesStore } from "./store";

export function useCastVotes() {
  const { canUpdateVotesInRealTime } = useContestStore(state => state);
  const { updateProposal } = useProposal();
  const { listProposalsData } = useProposalStore(state => state);
  const {
    castPositiveAmountOfVotes,
    pickedProposal,
    isLoading,
    isSuccess,
    error,
    setIsLoading,
    setIsSuccess,
    setError,
    setTransactionData,
  } = useCastVotesStore(state => state);
  const { address: userAddress, chain } = useAccount();
  const { asPath } = useRouter();
  const { updateCurrentUserVotes } = useUser();
  const { currentUserTotalVotesAmount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const { error: errorMessage, handleError } = useError();
  const { address: contestAddress, chainName } = extractPathSegments(asPath);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.[0]
    ?.id;
  const { fetchTotalVotesCast } = useTotalVotesCastOnContest(contestAddress, chainId);

  async function castVotes(amount: number, isPositive: boolean) {
    toastLoading("votes are deploying...");
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);
    const { abi } = await getContestContractVersion(contestAddress, chainId);

    try {
      const { proofs, isVerified } = await getProofs(userAddress ?? "", "vote", currentUserTotalVotesAmount.toString());

      let hash: `0x${string}`;

      if (!isVerified) {
        hash = await writeContract(config, {
          address: contestAddress as `0x${string}`,
          abi: abi ? abi : DeployedContestContract.abi,
          functionName: "castVote",
          args: [
            pickedProposal,
            isPositive ? 0 : 1,
            parseUnits(currentUserTotalVotesAmount.toString()),
            parseUnits(amount.toString()),
            proofs,
          ],
        });
      } else {
        hash = await writeContract(config, {
          address: contestAddress as `0x${string}`,
          abi: abi ? abi : DeployedContestContract.abi,
          functionName: "castVoteWithoutProof",
          args: [pickedProposal, isPositive ? 0 : 1, parseUnits(`${amount}`)],
        });
      }

      const receipt = await waitForTransactionReceipt(config, {
        chainId: chain?.id,
        hash: hash,
      });

      try {
        await addUserActionForAnalytics({
          contest_address: contestAddress,
          user_address: userAddress,
          network_name: chainName,
          proposal_id: pickedProposal !== null ? pickedProposal : undefined,
          vote_amount: amount,
          created_at: Math.floor(Date.now() / 1000),
        });
      } catch (error) {
        console.error("Error in addUserActionForAnalytics:", error);
      }

      setTransactionData({
        hash: receipt.transactionHash,
      });

      // We need this to update the votes either if there is more than 2 hours
      if (!canUpdateVotesInRealTime) {
        const voteResponse = (await readContract(config, {
          address: contestAddress as `0x${string}`,
          abi: DeployedContestContract.abi,
          functionName: "proposalVotes",
          args: [pickedProposal],
        })) as bigint[];

        const forVotes = voteResponse[0] as bigint;
        const againstVotes = voteResponse[1] as bigint;
        const votesBigNumber = BigNumber.from(forVotes).sub(againstVotes);
        const votes = Number(utils.formatEther(votesBigNumber));
        const existingProposal = listProposalsData.find(proposal => proposal.id === pickedProposal);

        if (existingProposal) {
          updateProposal(
            {
              ...existingProposal,
              netVotes: votes,
            },
            listProposalsData,
          );
        }
      }

      await updateCurrentUserVotes();
      fetchTotalVotesCast();
      setIsLoading(false);
      setIsSuccess(true);
      toastSuccess("your votes have been deployed successfully");
    } catch (e) {
      handleError(e, "something went wrong while casting your votes");
      setError(errorMessage);
      setIsLoading(false);
      throw e;
    }
  }

  return {
    setTransactionData,
    castVotes,
    isLoading,
    isSuccess,
    error,
    castPositiveAmountOfVotes,
  };
}

export default useCastVotes;
