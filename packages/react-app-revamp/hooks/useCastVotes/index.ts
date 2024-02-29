import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { chains } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { extractPathSegments } from "@helpers/extractPath";
import getContestContractVersion from "@helpers/getContestContractVersion";
import { useContestStore } from "@hooks/useContest/store";
import { VoteType } from "@hooks/useDeployContest/types";
import { useError } from "@hooks/useError";
import { useGenerateProof } from "@hooks/useGenerateProof";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { prepareWriteContract, readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { BigNumber, utils } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { useRouter } from "next/router";
import { formatEther, parseEther } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { useCastVotesStore } from "./store";

export function useCastVotes() {
  const { canUpdateVotesInRealTime, charge } = useContestStore(state => state);
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
  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();
  const { asPath } = useRouter();
  const { updateCurrentUserVotes } = useUser();
  const { currentUserTotalVotesAmount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const { error: errorMessage, handleError } = useError();
  const { address: contestAddress, chainName } = extractPathSegments(asPath);
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase())?.[0]
    ?.id;
  const { fetchTotalVotesCast } = useTotalVotesCastOnContest(contestAddress, chainId);

  async function castVotes(amountOfVotes: number, isPositive: boolean) {
    toastLoading("votes are deploying...");
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);
    const { abi } = await getContestContractVersion(contestAddress, chainId);
    const chargeAmount =
      charge && charge.voteType === VoteType.PerTransaction
        ? charge.type.costToVote ?? 0
        : (charge?.type.costToVote ?? 0) * amountOfVotes;
    const chargeAmountParsed = parseEther(chargeAmount.toString());

    try {
      const { proofs, isVerified } = await getProofs(userAddress ?? "", "vote", currentUserTotalVotesAmount.toString());

      let txRequest;

      if (!isVerified) {
        txRequest = await prepareWriteContract({
          address: contestAddress as `0x${string}`,
          //@ts-ignore
          abi: abi ? abi : DeployedContestContract.abi,
          functionName: "castVote",
          args: [
            pickedProposal,
            isPositive ? 0 : 1,
            parseUnits(currentUserTotalVotesAmount.toString()),
            parseUnits(amountOfVotes.toString()),
            proofs,
          ],
          //@ts-ignore ignore this error for now, we have this fixed in wagmi v2
          value: charge ? [charge.type.costToVote] : [],
        });
      } else {
        txRequest = await prepareWriteContract({
          address: contestAddress as `0x${string}`,
          //@ts-ignore
          abi: abi ? abi : DeployedContestContract.abi,
          functionName: "castVoteWithoutProof",
          args: [pickedProposal, isPositive ? 0 : 1, parseUnits(`${amountOfVotes}`)],
          //@ts-ignore ignore this error for now, we have this fixed in wagmi v2
          value: charge ? [charge.type.costToVote] : [],
        });
      }

      const txResult = await writeContract(txRequest);

      const receipt = await waitForTransaction({
        chainId: chain?.id,
        hash: txResult.hash,
        //@ts-ignore
        transactionHref: `${chain?.blockExplorers?.default?.url}/tx/${txResult?.hash}`,
      });

      try {
        await addUserActionForAnalytics({
          contest_address: contestAddress,
          user_address: userAddress,
          network_name: chainName,
          proposal_id: pickedProposal !== null ? pickedProposal : undefined,
          vote_amount: amountOfVotes,
          created_at: Math.floor(Date.now() / 1000),
          amount_sent: charge ? Number(formatEther(BigInt(chargeAmount))) : null,
          percentage_to_creator: charge ? charge.percentageToCreator : null,
        });
      } catch (error) {
        console.error("Error in addUserActionForAnalytics:", error);
      }

      setTransactionData({
        hash: receipt.transactionHash,
      });

      // We need this to update the votes either if there is more than 2 hours
      if (!canUpdateVotesInRealTime) {
        const voteResponse = (await readContract({
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
