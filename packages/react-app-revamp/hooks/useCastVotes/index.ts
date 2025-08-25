import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { LoadingToastMessageType } from "@components/UI/Toast/components/Loading";
import { chains, config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { useEmailSend } from "@hooks/useEmailSend";
import { useError } from "@hooks/useError";
import { useFetchUserVotesOnProposal } from "@hooks/useFetchUserVotesOnProposal";
import { useGenerateProof } from "@hooks/useGenerateProof";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useRewardsModule from "@hooks/useRewards";
import { useTotalRewards } from "@hooks/useTotalRewards";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { readContract, simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { parseUnits } from "ethers";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import { useCastVotesStore } from "./store";
import { performAnalytics, CombinedAnalyticsParams } from "./utils/analytics";
import { calculateChargeAmount } from "./utils/helpers";
import { createVotingEmailSender } from "./utils/email";
import { checkAndMarkPriceChangeError } from "utils/error";
import { usePriceTracking } from "./utils/priceTracking";

export function useCastVotes() {
  const {
    charge,
    contestAbi: abi,
    version,
    votesClose,
    anyoneCanVote,
  } = useContestStore(
    useShallow(state => ({
      charge: state.charge,
      contestAbi: state.contestAbi,
      version: state.version,
      votesClose: state.votesClose,
      anyoneCanVote: state.anyoneCanVote,
    })),
  );

  const { data: rewards } = useRewardsModule();
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
    resetStore,
  } = useCastVotesStore(state => state);
  const { address: userAddress } = useAccount();
  const asPath = usePathname();
  const { updateCurrentUserVotes } = useUser();
  const { currentUserTotalVotesAmount } = useUserStore(state => state);
  const { getProofs } = useGenerateProof();
  const { error: errorMessage, handleError } = useError();
  const { address: contestAddress, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName.toLowerCase(),
  )?.[0]?.id;
  const { retry: refetchTotalVotesCastOnContest } = useTotalVotesCastOnContest(contestAddress, chainId);
  const { refetch: refetchCurrentUserVotesOnProposal } = useFetchUserVotesOnProposal(
    contestAddress,
    pickedProposal ?? "",
  );
  const isEarningsTowardsRewards = rewards?.contractAddress === charge.splitFeeDestination.address;
  const { refetch: refetchTotalRewards } = useTotalRewards({
    rewardsModuleAddress: rewards?.contractAddress as `0x${string}`,
    rewardsModuleAbi: rewards?.abi,
    chainId,
  });
  const { sendEmail } = useEmailSend();
  const sendVotingEmail = createVotingEmailSender(sendEmail);
  const formattedVotesClose = moment(votesClose).format("MMMM Do, h:mm a");
  const contestLink = `${window.location.origin}/contest/${chainName.toLowerCase()}/${contestAddress}`;
  const { currentPricePerVote } = useCurrentPricePerVoteWithRefetch({
    address: contestAddress,
    abi: abi,
    chainId: chainId,
    version,
    votingClose: votesClose,
  });
  const { startNewVotingSession, getPrices } = usePriceTracking(currentPricePerVote);
  const getChargeAmount = useCallback(
    (amountOfVotes: number) => calculateChargeAmount(amountOfVotes, charge, currentPricePerVote),
    [charge, currentPricePerVote],
  );

  async function castVotes(amountOfVotes: number) {
    toastLoading({
      message: "votes are deploying...",
      additionalMessageType: LoadingToastMessageType.KEEP_BROWSER_OPEN,
    });
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);

    // Capture the price when voting starts
    startNewVotingSession();

    try {
      const { proofs, isVerified } = await getProofs(userAddress ?? "", "vote", currentUserTotalVotesAmount.toString());
      const costToVote = getChargeAmount(amountOfVotes);
      const totalVoteAmount = anyoneCanVote ? 0 : parseUnits(currentUserTotalVotesAmount.toString());

      let hash: `0x${string}`;
      let request;

      if (!isVerified) {
        const castVoteArgs = [pickedProposal, totalVoteAmount, parseUnits(amountOfVotes.toString()), proofs];
        const { request: simulatedRequest } = await simulateContract(config, {
          address: contestAddress as `0x${string}`,
          abi: abi ? abi : DeployedContestContract.abi,
          chainId,
          functionName: "castVote",
          args: castVoteArgs,
          //@ts-ignore
          value: costToVote,
        });
        request = simulatedRequest;
      } else {
        const castVoteWithoutProofArgs = [pickedProposal, parseUnits(`${amountOfVotes}`)];
        const { request: simulatedRequest } = await simulateContract(config, {
          address: contestAddress as `0x${string}`,
          abi: abi ? abi : DeployedContestContract.abi,
          chainId,
          functionName: "castVoteWithoutProof",
          args: castVoteWithoutProofArgs,
          //@ts-ignore
          value: costToVote,
        });
        request = simulatedRequest;
      }

      hash = await writeContract(config, request);
      const receipt = await waitForTransactionReceipt(config, { chainId, hash });

      // Perform analytics
      const analyticsParams: CombinedAnalyticsParams = {
        contestAddress,
        userAddress,
        chainName,
        pickedProposal,
        amountOfVotes,
        costToVote,
        charge,
        isEarningsTowardsRewards,
        address: contestAddress,
        rewardsModuleAddress: rewards?.contractAddress ?? "",
        operation: "deposit",
        token_address: null,
      };
      await performAnalytics(analyticsParams, refetchTotalRewards);

      setTransactionData({
        hash: receipt.transactionHash,
      });

      try {
        const voteCount = (await readContract(config, {
          address: contestAddress as `0x${string}`,
          abi: DeployedContestContract.abi,
          functionName: "proposalVotes",
          args: [pickedProposal],
        })) as bigint;

        const votes = Number(formatEther(voteCount));
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
      } catch (voteUpdateError) {
        console.error("Error updating proposal votes after casting:", voteUpdateError);
      }

      await updateCurrentUserVotes(abi, version, anyoneCanVote);
      refetchTotalVotesCastOnContest();
      refetchCurrentUserVotesOnProposal();
      setIsLoading(false);
      setIsSuccess(true);
      toastSuccess({
        message: "your votes have been deployed successfully",
      });

      await sendVotingEmail(userAddress ?? "", {
        contest_link: contestLink,
        contest_end_date: formattedVotesClose,
      });
    } catch (e) {
      const { initialPrice, currentPrice } = getPrices();

      const processedError = checkAndMarkPriceChangeError(e, initialPrice, currentPrice);

      handleError(processedError, "something went wrong while casting your votes");
      setError(errorMessage);
      setIsLoading(false);
      throw processedError;
    }
  }

  return {
    setTransactionData,
    castVotes,
    isLoading,
    isSuccess,
    error,
    castPositiveAmountOfVotes,
    resetStore,
  };
}

export default useCastVotes;
