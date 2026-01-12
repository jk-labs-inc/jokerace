import useContestVoteTimer from "@components/_pages/Submission/hooks/useContestVoteTimer";
import useNavigateProposals from "@components/_pages/Submission/hooks/useNavigateProposals";
import SubmissionPageMobileAddFunds from "@components/_pages/Submission/Mobile/components/AddFunds";
import StickyVoteFooter from "@components/_pages/Submission/Mobile/components/VoteFooter";
import SubmissionPageMobileVoting from "@components/_pages/Submission/Mobile/components/Voting";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useCurrentPricePerVote from "@hooks/useCurrentPricePerVote";
import { useVoteBalance } from "@hooks/useVoteBalance";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { useConnection } from "wagmi";
import { useShallow } from "zustand/shallow";

const SubmissionPageMobileVotingFooter = () => {
  const { isConnected, address } = useConnection();
  const { openConnectModal } = useConnectModal();
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const voteTimings = useSubmissionPageStore(useShallow(state => state.voteTimings));
  const { totalProposals } = useNavigateProposals();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const { isVotingOpen } = useContestVoteTimer({
    voteStart: voteTimings?.voteStart ?? null,
    contestDeadline: voteTimings?.contestDeadline ?? null,
  });
  const { currentPricePerVote } = useCurrentPricePerVote({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
    //TODO: check this
    votingClose: new Date(Number(voteTimings?.contestDeadline ?? 0)),
  });
  const { balance, insufficientBalance } = useVoteBalance({
    chainId: contestConfig.chainId,
    costToVote: currentPricePerVote,
  });

  const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  if (!isVotingOpen) return null;

  return (
    <>
      <StickyVoteFooter
        isConnected={isConnected}
        insufficientBalance={insufficientBalance}
        totalProposals={totalProposals}
        onConnectWallet={handleConnectWallet}
        setShowVotingModal={setShowVotingModal}
        onAddFunds={() => setShowAddFunds(true)}
      />
      {showAddFunds && (
        <SubmissionPageMobileAddFunds
          chain={contestConfig.chainName}
          asset={contestConfig.chainNativeCurrencySymbol}
          isOpen={showAddFunds}
          onClose={() => setShowAddFunds(false)}
        />
      )}
      {showVotingModal && (
        <SubmissionPageMobileVoting isOpen={showVotingModal} onClose={() => setShowVotingModal(false)} />
      )}
    </>
  );
};

export default SubmissionPageMobileVotingFooter;
