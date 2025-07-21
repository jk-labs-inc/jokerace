import { toastLoading, toastSuccess } from "@components/UI/Toast";
import { LoadingToastMessageType } from "@components/UI/Toast/components/Loading";
import { chains, config } from "@config/wagmi";
import DeployedContestContract from "@contracts/bytecodeAndAbi/Contest.sol/Contest.json";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import useCurrentPricePerVoteWithRefetch from "@hooks/useCurrentPricePerVoteWithRefetch";
import { Charge, VoteType } from "@hooks/useDeployContest/types";
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
import { addUserActionForAnalytics } from "lib/analytics/participants";
import { updateRewardAnalytics } from "lib/analytics/rewards";
import { EmailType, VotingEmailParams } from "lib/email/types";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import { useCastVotesStore } from "./store";

interface UserAnalyticsParams {
  contestAddress: string;
  userAddress: `0x${string}` | undefined;
  chainName: string;
  pickedProposal: string | null;
  amountOfVotes: number;
  costToVote: bigint | undefined;
  charge: Charge | null;
}

interface RewardsAnalyticsParams {
  isEarningsTowardsRewards: boolean;
  address: string;
  rewardsModuleAddress: string;
  charge: Charge | null;
  chainName: string;
  costToVote: bigint | undefined;
  operation: "deposit" | "withdraw";
  token_address: string | null;
}

interface CombinedAnalyticsParams extends UserAnalyticsParams, RewardsAnalyticsParams {}

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
  const isEarningsTowardsRewards = rewards?.contractAddress === charge?.splitFeeDestination.address;
  const { refetch: refetchTotalRewards } = useTotalRewards({
    rewardsModuleAddress: rewards?.contractAddress as `0x${string}`,
    rewardsModuleAbi: rewards?.abi,
    chainId,
  });
  const { sendEmail } = useEmailSend();
  const formattedVotesClose = moment(votesClose).format("MMMM Do, h:mm a");
  const contestLink = `${window.location.origin}/contest/${chainName.toLowerCase()}/${contestAddress}`;
  const {
    currentPricePerVote,
    isLoading: isLoadingCurrentPricePerVote,
    isError: isErrorCurrentPricePerVote,
  } = useCurrentPricePerVoteWithRefetch({
    address: contestAddress,
    abi: abi,
    chainId: chainId,
    version,
    votingClose: votesClose,
  });

  const calculateChargeAmount = useCallback(
    (amountOfVotes: number) => {
      if (!charge) return undefined;

      if (charge.voteType === VoteType.PerTransaction) {
        return BigInt(charge.type.costToVote);
      }

      const pricePerVoteInWei = parseEther(currentPricePerVote);
      const totalCost = BigInt(amountOfVotes) * pricePerVoteInWei;

      return totalCost;
    },
    [charge, currentPricePerVote],
  );

  const formatChargeAmount = (amount: number) => {
    return Number(formatEther(BigInt(amount)));
  };

  async function castVotes(amountOfVotes: number) {
    toastLoading("votes are deploying...", LoadingToastMessageType.KEEP_BROWSER_OPEN);
    setIsLoading(true);
    setIsSuccess(false);
    setError("");
    setTransactionData(null);

    try {
      const { proofs, isVerified } = await getProofs(userAddress ?? "", "vote", currentUserTotalVotesAmount.toString());
      const costToVote = calculateChargeAmount(amountOfVotes);
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

      const receipt = await waitForTransactionReceipt(config, {
        chainId,
        hash: hash,
      });

      await performAnalytics({
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
      });

      setTransactionData({
        hash: receipt.transactionHash,
      });

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

      await updateCurrentUserVotes(abi, version, anyoneCanVote);
      refetchTotalVotesCastOnContest();
      refetchCurrentUserVotesOnProposal();
      setIsLoading(false);
      setIsSuccess(true);
      toastSuccess("your votes have been deployed successfully");

      await sendVotingEmail({
        contest_link: contestLink,
        contest_end_date: formattedVotesClose,
      });
    } catch (e) {
      handleError(e, "something went wrong while casting your votes");
      setError(errorMessage);
      setIsLoading(false);
      throw e;
    }
  }

  async function addUserActionAnalytics(params: UserAnalyticsParams) {
    try {
      await addUserActionForAnalytics({
        contest_address: params.contestAddress,
        user_address: params.userAddress,
        network_name: params.chainName,
        proposal_id: params.pickedProposal !== null ? params.pickedProposal : undefined,
        vote_amount: params.amountOfVotes,
        created_at: Math.floor(Date.now() / 1000),
        amount_sent: params.costToVote ? formatChargeAmount(parseFloat(params.costToVote.toString())) : null,
        percentage_to_creator: params.charge ? params.charge.percentageToCreator : null,
      });
    } catch (error) {
      console.error("Error in addUserActionForAnalytics:", error);
    }
  }

  async function updateRewardAnalyticsIfNeeded(params: RewardsAnalyticsParams) {
    if (params.isEarningsTowardsRewards && params.costToVote && params.charge) {
      try {
        await updateRewardAnalytics({
          contest_address: params.address,
          rewards_module_address: params.rewardsModuleAddress,
          network_name: params.chainName,
          amount:
            formatChargeAmount(parseFloat(params.costToVote.toString())) * (params.charge.percentageToCreator / 100),
          operation: "deposit",
          token_address: null,
          created_at: Math.floor(Date.now() / 1000),
        });
      } catch (error) {
        console.error("Error while updating reward analytics", error);
      }
      refetchTotalRewards();
    }
  }

  async function performAnalytics(params: CombinedAnalyticsParams) {
    try {
      await addUserActionAnalytics(params);
      await updateRewardAnalyticsIfNeeded(params);
    } catch (error) {
      console.error("Error in performAnalytics:", error);
    }
  }

  async function sendVotingEmail(params: VotingEmailParams) {
    await sendEmail(userAddress ?? "", EmailType.VotingEmail, params);
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
