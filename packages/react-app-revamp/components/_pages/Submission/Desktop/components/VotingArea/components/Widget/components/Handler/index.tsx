import { useVotingActions } from "@components/_pages/Submission/hooks/useVotingActions";
import { useVotingSetup } from "@components/_pages/Submission/hooks/useVotingSetup";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import AddFunds from "@components/AddFunds";
import VotingWidget, { VotingWidgetStyle } from "@components/Voting";
import { ContestStateEnum } from "@hooks/useContestState/store";
import { Charge } from "@hooks/useDeployContest/types";
import { FC, useState } from "react";
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
  const submissionsCount = useSubmissionPageStore(useShallow(state => state.allProposalIds.length));
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const { contestConfig, contestDetails, currentPricePerVote, currentPricePerVoteRaw, isVotingOpen } = useVotingSetup(
    votesClose,
    address,
  );
  const { castVotes, isLoading } = useVotingActions({ charge, votesClose });

  const onVote = (amount: number) => {
    castVotes(amount);
  };

  return (
    <div className="relative">
      <div
        className={`pl-8 pt-4 pb-6 pr-12 rounded-4xl ${
          showAddFundsModal ? "bg-primary-13" : "bg-gradient-voting-area"
        }`}
      >
        {showAddFundsModal ? (
          <AddFunds
            chain={contestConfig.chainName}
            asset={contestConfig.chainNativeCurrencySymbol}
            onGoBack={() => setShowAddFundsModal(false)}
          />
        ) : (
          <VotingWidget
            costToVote={currentPricePerVote}
            costToVoteRaw={currentPricePerVoteRaw}
            style={VotingWidgetStyle.colored}
            isLoading={isLoading}
            isVotingClosed={!isVotingOpen}
            isContestCanceled={contestDetails.state === ContestStateEnum.Canceled}
            submissionsCount={submissionsCount}
            onAddFunds={() => setShowAddFundsModal(true)}
            onVote={onVote}
          />
        )}
      </div>
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetHandler;
