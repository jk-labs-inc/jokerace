import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { LoadingToastMessageType } from "@components/UI/Toast/components/Loading";
import { config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePerVote from "@hooks/useCurrentPricePerVote";
import { Charge } from "@hooks/useDeployContest/types";
import { useEmailSend } from "@hooks/useEmailSend";
import { useError } from "@hooks/useError";
import { useFetchUserVotesOnProposal } from "@hooks/useFetchUserVotesOnProposal";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import useRewardsModule from "@hooks/useRewards";
import { useTotalRewards } from "@hooks/useTotalRewards";
import useTotalVotesCastOnContest from "@hooks/useTotalVotesCastOnContest";
import { readContract, simulateContract, waitForTransactionReceipt, writeContract } from "@wagmi/core";
import moment from "moment";
import { checkAndMarkPriceChangeError } from "utils/error";
import { formatEther, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import { useCastVotesStore } from "./store";
import { CombinedAnalyticsParams, performAnalytics } from "./utils/analytics";
import { createVotingEmailSender } from "./utils/email";
import { usePriceTracking } from "./utils/priceTracking";
import { calculateChargeAmount } from "./utils/helpers";
import { useVoteBalance } from "@hooks/useVoteBalance";
import useEmailSignup from "@hooks/useEmailSignup";
import { useVotingStore } from "@components/Voting/store";

interface UseCastVotesProps {
  charge: Charge;
  votesClose: Date;
}

export function useCastVotes({ charge, votesClose }: UseCastVotesProps) {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
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
  const { error: errorMessage, handleError } = useError();
  const { refetch: refetchTotalVotesCastOnContest } = useTotalVotesCastOnContest(
    contestConfig.address,
    contestConfig.chainId,
  );
  const { refetch: refetchCurrentUserVotesOnProposal } = useFetchUserVotesOnProposal(
    contestConfig.address,
    pickedProposal ?? "",
  );
  const isEarningsTowardsRewards = rewards?.contractAddress === charge.splitFeeDestination.address;
  const { refetch: refetchTotalRewards } = useTotalRewards({
    rewardsModuleAddress: rewards?.contractAddress as `0x${string}`,
    rewardsModuleAbi: rewards?.abi,
    chainId: contestConfig.chainId,
  });
  const { sendEmail } = useEmailSend();
  const sendVotingEmail = createVotingEmailSender(sendEmail);
  const formattedVotesClose = moment(votesClose).format("MMMM Do, h:mm a");
  const contestLink = `${window.location.origin}/contest/${contestConfig.chainName.toLowerCase()}/${
    contestConfig.address
  }`;
  const { currentPricePerVote, currentPricePerVoteRaw } = useCurrentPricePerVote({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    votingClose: votesClose,
  });
  const { startNewVotingSession, getPrices } = usePriceTracking(currentPricePerVote);
  const { refetchBalance } = useVoteBalance({
    chainId: contestConfig.chainId,
    costToVote: currentPricePerVote,
  });
  const { emailAddress, resetVotingStore } = useVotingStore(
    useShallow(state => ({
      emailAddress: state.emailAddress,
      resetVotingStore: state.reset,
    })),
  );
  const { subscribeUser } = useEmailSignup();

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
      const castVoteArgs = [pickedProposal, parseUnits(amountOfVotes.toString(), 18)];

      const estimatedCost = calculateChargeAmount(amountOfVotes, currentPricePerVoteRaw);

      const { request } = await simulateContract(config, {
        address: contestConfig.address as `0x${string}`,
        abi: contestConfig.abi ? contestConfig.abi : DeployedContestContract.abi,
        chainId: contestConfig.chainId,
        functionName: "castVote",
        args: castVoteArgs,
        //@ts-ignore
        value: estimatedCost,
      });

      const hash = await writeContract(config, request);
      const receipt = await waitForTransactionReceipt(config, { chainId: contestConfig.chainId, hash });

      const analyticsParams: CombinedAnalyticsParams = {
        contestAddress: contestConfig.address,
        userAddress,
        chainName: contestConfig.chainName,
        pickedProposal,
        amountOfVotes,
        costToVote: estimatedCost,
        charge,
        isEarningsTowardsRewards,
        address: contestConfig.address,
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
          address: contestConfig.address as `0x${string}`,
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

      refetchTotalVotesCastOnContest();
      refetchCurrentUserVotesOnProposal();
      refetchBalance?.();
      setIsLoading(false);
      setIsSuccess(true);
      toastSuccess({
        message: "your votes have been deployed successfully",
      });

      if (emailAddress) {
        await subscribeUser(emailAddress, userAddress);
      }

      resetVotingStore();

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
