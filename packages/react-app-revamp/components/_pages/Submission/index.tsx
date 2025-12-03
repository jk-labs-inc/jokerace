import SubmissionPageDesktopLayout from "@components/_pages/Submission/Desktop";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useProposalIdStore from "@hooks/useProposalId/store";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useShallow } from "zustand/shallow";
import SubmissionPageMobileLayout from "./Mobile";

const SubmissionPage = () => {
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const setPickProposal = useCastVotesStore(useShallow(state => state.setPickedProposal));
  const isMobile = useMediaQuery({ maxWidth: "968px" });

  useEffect(() => {
    setPickProposal(proposalId);
  }, [proposalId, setPickProposal]);

  if (isMobile) {
    return <SubmissionPageMobileLayout />;
  }

  return <SubmissionPageDesktopLayout />;
};

export default SubmissionPage;
