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
import { useAddressesVoted } from "../Voters/hooks/useAddressesVoted";
import { useConnectModal } from "@rainbow-me/rainbowkit";

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
  const { refetchAddressesVoted } = useAddressesVoted({
    contestAddress: contestConfig.address,
    contestAbi: contestConfig.abi,
    contestChainId: contestConfig.chainId,
    proposalId: proposalId,
  });

  const onVote = async (amount: number) => {
    try {
      await castVotes(amount);
      refetchProposalVotes();
      //TODO: move this out, since it's only changing when new addresses arrive, not refetching on old addresses
      refetchAddressesVoted();
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
              onVote={onVote}
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
