import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContest } from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { useError } from "@hooks/useError";
import { useGenerateProof } from "@hooks/useGenerateProof";
import { useProposalStore } from "@hooks/useProposal/store";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { prepareWriteContract, readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { useRouter } from "next/router";
import { useAccount, useNetwork } from "wagmi";
import { useCastVotesStore } from "./store";

export function useCastVotes() {
  const { fetchTotalVotesCast } = useContest();
  const { canUpdateVotesInRealTime } = useContestStore(state => state);
  const { setProposalVotes } = useProposalStore(state => state);
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
  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();
  const { asPath } = useRouter();
  const { updateCurrentUserVotes } = useUser();
  const { currentUserTotalVotesAmount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const { error: errorMessage, handleError } = useError();
  const [contestId, chainName] = [asPath.split("/")[3], asPath.split("/")[2]];
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.[0]
    ?.id;

  async function castVotes(amount: number, isPositive: boolean) {
    toastLoading("votes are deploying...");
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);
    const { abi } = await getContestContractVersion(contestId, chainId);

    try {
      const proofs = await getProofs(userAddress ?? "", "vote", currentUserTotalVotesAmount.toString());

      let txRequest;

      if (proofs) {
        txRequest = await prepareWriteContract({
          address: contestId as `0x${string}`,
          //@ts-ignore
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
        txRequest = await prepareWriteContract({
          address: contestId as `0x${string}`,
          //@ts-ignore
          abi: abi ? abi : DeployedContestContract.abi,
          functionName: "castVoteWithoutProof",
          args: [pickedProposal, isPositive ? 0 : 1, parseUnits(`${amount}`)],
        });
      }

      const txResult = await writeContract(txRequest);

      const receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txResult.hash,
        //@ts-ignore
        transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txResult?.hash}`,
      });

      setTransactionData({
        hash: receipt.transactionHash,
      });

      // We need this to update the votes either if there is more than 2 hours
      if (!canUpdateVotesInRealTime) {
        const voteResponse = (await readContract({
          address: asPath.split("/")[3] as `0x${string}`,
          abi: DeployedContestContract.abi,
          functionName: "proposalVotes",
          args: [pickedProposal],
        })) as bigint[];

        const forVotes = voteResponse[0] as bigint;
        const againstVotes = voteResponse[1] as bigint;

        const votesBigNumber = BigNumber.from(forVotes).sub(againstVotes);

        const votes = Number(utils.formatEther(votesBigNumber));

        await fetchTotalVotesCast();

        //@ts-ignore
        setProposalVotes({
          id: pickedProposal,
          votes,
        });
      }

      await updateCurrentUserVotes();
      setIsLoading(false);
      setIsSuccess(true);
      toastSuccess("your votes have been deployed successfully");

      addUserActionForAnalytics({
        contest_address: contestId,
        user_address: userAddress,
        network_name: chainName,
        proposal_id: pickedProposal !== null ? pickedProposal : undefined,
        vote_amount: amount,
        created_at: Math.floor(Date.now() / 1000),
      });
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
