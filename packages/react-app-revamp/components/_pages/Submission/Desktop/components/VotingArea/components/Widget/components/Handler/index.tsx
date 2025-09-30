import AddFunds from "@components/AddFunds";
import VotingWidget, { VotingWidgetStyle } from "@components/Voting";
import useCastVotes from "@hooks/useCastVotes";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { Charge } from "@hooks/useDeployContest/types";
import useProposalVotes from "@hooks/useProposalVotes";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";

interface SubmissionPageDesktopVotingAreaWidgetHandlerProps {
  charge: Charge;
  votesClose: Date;
}

const SubmissionPageDesktopVotingAreaWidgetHandler: FC<SubmissionPageDesktopVotingAreaWidgetHandlerProps> = ({
  charge,
  votesClose,
}) => {
  const { address } = useAccount();
  const { contestConfig, proposalId } = useContestConfigStore(useShallow(state => state));
  const { checkIfCurrentUserQualifyToVote } = useUser();
  const currentUserAvailableVotesAmount = useUserStore(useShallow(state => state.currentUserAvailableVotesAmount));
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const { castVotes } = useCastVotes({ charge: charge, votesClose: votesClose });
  const { isLoading } = useCastVotesStore(state => state);
  const { refetch: refetchProposalVotes } = useProposalVotes({
    contestAddress: contestConfig.address,
    proposalId: proposalId,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
  });

  const onVote = async (amount: number) => {
    try {
      await castVotes(amount);
      refetchProposalVotes();
    } catch (error) {
      console.error("Failed to cast vote:", error);
    }
  };

  useEffect(() => {
    checkIfCurrentUserQualifyToVote({
      address: contestConfig.address,
      abi: contestConfig.abi,
      chainId: contestConfig.chainId,
    });
  }, [address]);

  return (
    <div
      className={`pl-8 pt-4 pb-6 pr-12 rounded-4xl ${showAddFundsModal ? "bg-primary-13" : "bg-gradient-voting-area "}`}
    >
      {showAddFundsModal ? (
        <AddFunds
          chain={contestConfig.chainName}
          asset={contestConfig.chainNativeCurrencySymbol}
          onGoBack={() => setShowAddFundsModal(false)}
        />
      ) : (
        <VotingWidget
          amountOfVotes={currentUserAvailableVotesAmount}
          style={VotingWidgetStyle.colored}
          isLoading={isLoading}
          isVotingClosed={false}
          isContestCanceled={false}
          onAddFunds={() => {
            setShowAddFundsModal(true);
          }}
          onVote={onVote}
        />
      )}
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetHandler;
