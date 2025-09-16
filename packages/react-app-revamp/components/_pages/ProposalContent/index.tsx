import { toastInfo } from "@components/UI/Toast";
import { extractPathSegments } from "@helpers/extractPath";
import { Tweet as TweetType } from "@helpers/isContentTweet";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStateEnum, useContestStateStore } from "@hooks/useContestState/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import useProfileData from "@hooks/useProfileData";
import { RawMetadataFields } from "@hooks/useProposal/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import moment from "moment";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";
import DialogModalVoteForProposal from "../DialogModalVoteForProposal";
import ProposalLayoutClassic from "./components/ProposalLayout/Classic";
import ProposalLayoutGallery from "./components/ProposalLayout/Gallery";
import ProposalLayoutLeaderboard from "./components/ProposalLayout/Leaderboard";
import ProposalLayoutTweet from "./components/ProposalLayout/Tweet";

export interface Proposal {
  id: string;
  authorEthereumAddress: string;
  content: string;
  exists: boolean;
  isContentImage: boolean;
  tweet: TweetType;
  votes: number;
  rank: number;
  isTied: boolean;
  commentsCount: number;
  metadataFields: RawMetadataFields;
}

interface ProposalContentProps {
  proposal: Proposal;
  contestAuthorEthereumAddress: string;
  enabledPreview: EntryPreview | null;
  selectedProposalIds: string[];
  toggleProposalSelection?: (proposalId: string) => void;
}

const ProposalContent: FC<ProposalContentProps> = ({
  proposal,
  contestAuthorEthereumAddress,
  selectedProposalIds,
  toggleProposalSelection,
  enabledPreview,
}) => {
  const { isConnected, address: userAddress } = useAccount();
  const { canDeleteProposal } = useDeleteProposal();
  const contestStatus = useContestStatusStore(useShallow(state => state.contestStatus));
  const allowDelete = canDeleteProposal(
    userAddress,
    contestAuthorEthereumAddress,
    proposal.authorEthereumAddress,
    contestStatus,
  );
  const { openConnectModal } = useConnectModal();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const asPath = usePathname();
  const { chainName, address: contestAddress } = extractPathSegments(asPath ?? "");
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const { votesOpen } = useContestStore(state => state);
  const { contestState } = useContestStateStore(state => state);
  const isContestCanceled = contestState === ContestStateEnum.Canceled;
  const setPickProposal = useCastVotesStore(useShallow(state => state.setPickedProposal));
  const formattedVotingOpen = moment(votesOpen);
  const commentLink = {
    pathname: `/contest/${chainName}/${contestAddress}/submission/${proposal.id}`,
    query: { comments: "comments" },
  };
  const {
    profileAvatar,
    profileName,
    isLoading: isUserProfileLoading,
    isError: isUserProfileError,
  } = useProfileData(proposal.authorEthereumAddress, true);

  const handleVotingModalOpen = () => {
    if (isContestCanceled) {
      alert("This contest has been canceled and voting is terminated.");
      return;
    }

    if (contestStatus === ContestStatus.VotingClosed) {
      toastInfo({
        message: "Voting is closed for this contest.",
      });
      return;
    }

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    setPickProposal(proposal.id);
    setIsVotingModalOpen(true);
  };

  const props = {
    proposal,
    proposalAuthorData: {
      name: profileName,
      avatar: profileAvatar,
      isLoading: isUserProfileLoading,
      isError: isUserProfileError,
    },
    isMobile,
    chainName,
    contestAddress,
    contestStatus,
    allowDelete,
    selectedProposalIds,
    handleVotingModalOpen,
    toggleProposalSelection,
    formattedVotingOpen,
    enabledPreview,
    commentLink: commentLink.pathname,
  };

  const renderLayout = () => {
    switch (enabledPreview) {
      case EntryPreview.TITLE:
        return <ProposalLayoutLeaderboard {...props} />;
      case EntryPreview.IMAGE:
      case EntryPreview.IMAGE_AND_TITLE:
        return <ProposalLayoutGallery {...props} />;
      case EntryPreview.TWEET:
        return <ProposalLayoutTweet {...props} />;
      default:
        return <ProposalLayoutClassic {...props} />;
    }
  };

  return (
    <>
      {renderLayout()}
      <DialogModalVoteForProposal isOpen={isVotingModalOpen} setIsOpen={setIsVotingModalOpen} proposal={proposal} />
    </>
  );
};

export default ProposalContent;
