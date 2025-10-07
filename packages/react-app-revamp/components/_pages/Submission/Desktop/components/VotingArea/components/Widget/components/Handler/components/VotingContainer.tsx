import AddFunds from "@components/AddFunds";
import VotingWidget, { VotingWidgetStyle } from "@components/Voting";
import { ContestStateEnum } from "@hooks/useContestState/store";
import { FC, ReactNode } from "react";

interface VotingContainerProps {
  isConnected: boolean;
  showAddFundsModal: boolean;
  chainName: string;
  chainNativeCurrencySymbol: string;
  amountOfVotes: number;
  costToVote: number;
  isLoading: boolean;
  isVotingOpen: boolean;
  contestState: ContestStateEnum;
  onGoBack: () => void;
  onAddFunds: () => void;
  onVote: (amount: number) => void;
  connectOverlay: ReactNode;
}

const VotingContainer: FC<VotingContainerProps> = ({
  isConnected,
  showAddFundsModal,
  chainName,
  chainNativeCurrencySymbol,
  amountOfVotes,
  costToVote,
  isLoading,
  isVotingOpen,
  contestState,
  onGoBack,
  onAddFunds,
  onVote,
  connectOverlay,
}) => {
  return (
    <div className="relative">
      <div
        className={`pl-8 pt-4 pb-6 pr-12 rounded-4xl ${
          showAddFundsModal ? "bg-primary-13" : "bg-gradient-voting-area"
        }`}
      >
        <div className={`${!isConnected ? "blur-lg pointer-events-none" : ""}`}>
          {showAddFundsModal ? (
            <AddFunds chain={chainName} asset={chainNativeCurrencySymbol} onGoBack={onGoBack} />
          ) : (
            <VotingWidget
              amountOfVotes={amountOfVotes}
              costToVote={costToVote}
              style={VotingWidgetStyle.colored}
              isLoading={isLoading}
              isVotingClosed={!isVotingOpen}
              isContestCanceled={contestState === ContestStateEnum.Canceled}
              onAddFunds={onAddFunds}
              onVote={onVote}
            />
          )}
        </div>
      </div>
      {!isConnected && connectOverlay}
    </div>
  );
};

export default VotingContainer;
