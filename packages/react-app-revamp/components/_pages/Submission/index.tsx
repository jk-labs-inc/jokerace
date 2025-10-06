import SubmissionPageDesktopLayout from "@components/_pages/Submission/Desktop";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import SubmissionPageMobileLayout from "./Mobile";
import { useCastVotesStore } from "@hooks/useCastVotes/store";
import useProposalIdStore from "@hooks/useProposalId/store";
import { useShallow } from "zustand/shallow";

const SubmissionPage = () => {
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const setPickProposal = useCastVotesStore(useShallow(state => state.setPickedProposal));
  const isMobile = useMediaQuery({ maxWidth: "968px" });
  const router = useRouter();

  useEffect(() => {
    setPickProposal(proposalId);
  }, [proposalId, setPickProposal]);

  useEffect(() => {
    // prefetch close route
    const contestRoute = `/contest/${contestConfig.chainName}/${contestConfig.address}`;
    router.prefetch(contestRoute);
  }, [contestConfig.chainName, contestConfig.address, router]);

  if (isMobile) {
    return <SubmissionPageMobileLayout />;
  }

  return <SubmissionPageDesktopLayout />;
};

export default SubmissionPage;
