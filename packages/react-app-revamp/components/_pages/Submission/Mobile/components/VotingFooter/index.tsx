import useNavigateProposals from "@components/_pages/Submission/hooks/useNavigateProposals";
import useContestVoteTimer from "@components/_pages/Submission/hooks/useContestVoteTimer";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import SubmissionPageMobileAddFunds from "@components/_pages/Submission/Mobile/components/AddFunds";
import SubmissionPageMobileVoting from "@components/_pages/Submission/Mobile/components/Voting";
import StickyVoteFooter from "@components/_pages/Submission/Mobile/components/VoteFooter";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import useUser from "@hooks/useUser";

const SubmissionPageMobileVotingFooter = () => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const voteTimings = useSubmissionPageStore(useShallow(state => state.voteTimings));
  const { checkIfCurrentUserQualifyToVote } = useUser();
  const currentUserAvailableVotesAmount = useUserStore(useShallow(state => state.currentUserAvailableVotesAmount));
  const { totalProposals } = useNavigateProposals();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const { isVotingOpen } = useContestVoteTimer({
    voteStart: voteTimings?.voteStart ?? null,
    contestDeadline: voteTimings?.contestDeadline ?? null,
  });

  useEffect(() => {
    checkIfCurrentUserQualifyToVote({
      address: contestConfig.address,
      abi: contestConfig.abi,
      chainId: contestConfig.chainId,
    });
  }, [address]);

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
        totalProposals={totalProposals}
        currentUserAvailableVotesAmount={currentUserAvailableVotesAmount}
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
