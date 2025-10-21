import AddFunds from "@components/AddFunds";
import Drawer from "@components/UI/Drawer";
import VotingWidget from "@components/Voting";
import { FC } from "react";

interface MobileVotingDrawerProps {
  isOpen: boolean;
  showAddFunds: boolean;
  chainName: string;
  chainNativeCurrencySymbol: string;
  costToVote: string;
  costToVoteRaw: bigint;
  isLoading: boolean;
  isVotingOpen: boolean;
  isContestCanceled: boolean;
  onClose: () => void;
  onGoBack: () => void;
  onAddFunds: () => void;
  onVote: (amount: number) => void;
}

const MobileVotingDrawer: FC<MobileVotingDrawerProps> = ({
  isOpen,
  showAddFunds,
  chainName,
  chainNativeCurrencySymbol,
  costToVote,
  costToVoteRaw,
  isLoading,
  isVotingOpen,
  isContestCanceled,
  onClose,
  onGoBack,
  onAddFunds,
  onVote,
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} className="bg-true-black w-full h-auto">
      <div className="flex flex-col gap-4 p-6">
        {showAddFunds ? (
          <AddFunds chain={chainName} asset={chainNativeCurrencySymbol} onGoBack={onGoBack} />
        ) : (
          <VotingWidget
            costToVote={costToVote}
            costToVoteRaw={costToVoteRaw}
            isLoading={isLoading}
            isVotingClosed={!isVotingOpen}
            isContestCanceled={isContestCanceled}
            onVote={onVote}
            onAddFunds={onAddFunds}
          />
        )}
      </div>
    </Drawer>
  );
};

export default MobileVotingDrawer;
