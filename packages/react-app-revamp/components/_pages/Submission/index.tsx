import { chains } from "@config/wagmi";
import useCastVotes from "@hooks/useCastVotes";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { FC } from "react";
import { useMediaQuery } from "react-responsive";
import { Proposal } from "../ProposalContent";
import SubmissionPageDesktopLayout from "./Desktop";
import SubmissionPageMobileLayout from "./Mobile";

interface SubmissionPageProps {
  chain: string;
  address: string;
  proposalId: string;
  prompt: string;
  proposal: Proposal;
}

const SubmissionPage: FC<SubmissionPageProps> = ({ chain: chainName, address, proposalId, prompt, proposal }) => {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const { openConnectModal } = useConnectModal();
  const { castVotes } = useCastVotes();
  const {
    decreaseCurrentUserAvailableVotesAmount,
    increaseCurrentUserAvailableVotesAmount,
    increaseCurrentUserTotalVotesCast,
    decreaseCurrentUserTotalVotesCast,
  } = useUserStore(state => state);

  const handleCastVotes = (amount: number, isUpvote: boolean) => {
    decreaseCurrentUserAvailableVotesAmount(amount);
    increaseCurrentUserTotalVotesCast(amount);

    castVotes(amount, isUpvote).catch(error => {
      increaseCurrentUserAvailableVotesAmount(amount);
      decreaseCurrentUserTotalVotesCast(amount);
    });
  };

  async function requestAccount() {
    try {
      const accounts = await window.ethereum?.request({
        method: "eth_requestAccounts",
      });
      return accounts?.[0];
    } catch (error) {
      console.error("User denied account access");
      return null;
    }
  }

  const onConnectWallet = async () => {
    await requestAccount();
    openConnectModal?.();
  };

  const onClose = () => {
    router.push(`/contest/${chainName}/${address}`, undefined, { shallow: true, scroll: false });
  };

  const onSwipe = (proposalId: string) => {
    router.push(`/contest/${chainName}/${address}/submission/${proposalId}`);
  };

  if (isMobile) {
    return (
      <SubmissionPageMobileLayout
        prompt={prompt}
        proposal={proposal}
        proposalId={proposalId}
        onClose={onClose}
        onVote={handleCastVotes}
        onConnectWallet={onConnectWallet}
        onSwipe={onSwipe}
      />
    );
  }

  return <SubmissionPageDesktopLayout prompt={prompt} proposal={proposal} proposalId={proposalId} onClose={onClose} />;
};

export default SubmissionPage;
