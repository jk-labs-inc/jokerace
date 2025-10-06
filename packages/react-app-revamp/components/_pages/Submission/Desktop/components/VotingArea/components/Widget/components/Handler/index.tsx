import AddFunds from "@components/AddFunds";
import VotingWidget, { VotingWidgetStyle } from "@components/Voting";
import useCastVotes from "@hooks/useCastVotes";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useProposalIdStore from "@hooks/useProposalId/store";
import { Charge } from "@hooks/useDeployContest/types";
import { useProposalVoters } from "@hooks/useProposalVoters";
import useProposalVotes from "@hooks/useProposalVotes";
import useUser from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
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
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const { checkIfCurrentUserQualifyToVote } = useUser();
  const currentUserAvailableVotesAmount = useUserStore(useShallow(state => state.currentUserAvailableVotesAmount));
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const { castVotes } = useCastVotes({ charge: charge, votesClose: votesClose });
  const { isLoading, isSuccess } = useCastVotesStore(state => state);
  const { refetch: refetchProposalVotes } = useProposalVotes({
    contestAddress: contestConfig.address,
    proposalId: proposalId,
    chainId: contestConfig.chainId,
    abi: contestConfig.abi,
  });
  const { refetch: refetchProposalVoters } = useProposalVoters(
    contestConfig.address,
    proposalId,
    contestConfig.chainId,
  );

  useEffect(() => {
    if (isLoading) return;

    if (isSuccess) {
      // Add delay to ensure blockchain state has propagated to RPC nodes
      const refetchWithDelay = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        refetchProposalVotes();
        refetchProposalVoters();
      };

      refetchWithDelay();
    }
  }, [isSuccess, isLoading, refetchProposalVotes, refetchProposalVoters]);

  useEffect(() => {
    checkIfCurrentUserQualifyToVote({
      address: contestConfig.address,
      abi: contestConfig.abi,
      chainId: contestConfig.chainId,
    });
  }, [address]);

  return (
    <div className="relative">
      <div
        className={`pl-8 pt-4 pb-6 pr-12 rounded-4xl ${
          showAddFundsModal ? "bg-primary-13" : "bg-gradient-voting-area"
        }`}
      >
        <div className={`${!isConnected ? "blur-lg pointer-events-none" : ""}`}>
          {showAddFundsModal ? (
            <AddFunds
              chain={contestConfig.chainName}
              asset={contestConfig.chainNativeCurrencySymbol}
              onGoBack={() => setShowAddFundsModal(false)}
            />
          ) : (
            //TODO: we should prolly pass currentPricePerVote to the widget
            <VotingWidget
              amountOfVotes={currentUserAvailableVotesAmount}
              costToVote={charge.type.costToVote}
              style={VotingWidgetStyle.colored}
              isLoading={isLoading}
              isVotingClosed={false}
              isContestCanceled={false}
              onAddFunds={() => {
                setShowAddFundsModal(true);
              }}
              onVote={castVotes}
            />
          )}
        </div>
      </div>

      {!isConnected && (
        <button className="absolute inset-0 flex items-center justify-center" onClick={openConnectModal}>
          <p className="text-positive-11 text-[16px] font-bold">connect wallet to add votes</p>
        </button>
      )}
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetHandler;
