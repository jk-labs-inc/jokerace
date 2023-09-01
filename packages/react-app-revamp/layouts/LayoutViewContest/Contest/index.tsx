import ButtonV3 from "@components/UI/ButtonV3";
import DialogModalSendProposal from "@components/_pages/DialogModalSendProposal";
import ListProposals from "@components/_pages/ListProposals";
import useContest from "@hooks/useContest";
import { useContestStore } from "@hooks/useContest/store";
import { ContestStatus, useContestStatusStore } from "@hooks/useContestStatus/store";
import { useProposalStore } from "@hooks/useProposal/store";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { useUserStore } from "@hooks/useUser/store";
import moment from "moment";
import { useAccount } from "wagmi";
import LayoutContestPrompt from "../Prompt";
import ProposalStatistics from "../ProposalStatistics";
import ContestLayoutStickyCards from "../StickyCards";
import LayoutContestTimeline from "../TimelineV3";

const ContestTab = () => {
  const { submissionsOpen, contestPrompt, contestMaxProposalCount } = useContestStore(state => state);
  const { isConnected } = useAccount();
  const { contestStatus } = useContestStatusStore(state => state);
  const { contestMaxNumberSubmissionsPerUser, currentUserQualifiedToSubmit, currentUserProposalCount, isLoading } =
    useUserStore(state => state);
  const { isListProposalsLoading, isListProposalsSuccess, listProposalsIds } = useProposalStore(state => state);
  const { isLoading: isContestLoading, isSuccess: isContestSuccess } = useContest();
  const { isSubmitProposalModalOpen, setIsSubmitProposalModalOpen } = useSubmitProposalStore(state => ({
    isSubmitProposalModalOpen: state.isModalOpen,
    setIsSubmitProposalModalOpen: state.setIsModalOpen,
  }));
  const submitButtonText = isConnected ? "submit a response" : "connect wallet to submit";
  const qualifiedToSubmit =
    currentUserQualifiedToSubmit && currentUserProposalCount <= contestMaxNumberSubmissionsPerUser;
  const showSubmitButton = !isConnected || qualifiedToSubmit;
  const proposalsMaxCountReached = listProposalsIds.length >= contestMaxProposalCount;

  return (
    <div>
      <div className="mt-4">
        <LayoutContestTimeline />
      </div>

      <div className="mt-8">
        <LayoutContestPrompt prompt={contestPrompt} hidePrompt={contestStatus === ContestStatus.VotingClosed} />
      </div>
      {contestStatus === ContestStatus.SubmissionOpen && (
        <div className="mt-8">
          {isLoading || isListProposalsLoading ? null : showSubmitButton && !proposalsMaxCountReached ? (
            <ButtonV3
              type="txAction"
              color="bg-gradient-create rounded-[40px]"
              size="extraLargeLong"
              onClick={() => setIsSubmitProposalModalOpen(!isSubmitProposalModalOpen)}
            >
              {submitButtonText}
            </ButtonV3>
          ) : (
            <p className="text-primary-10 text-[16px]">No more submissions are allowed for this contest.</p>
          )}
        </div>
      )}
      <ContestLayoutStickyCards />

      {contestStatus === ContestStatus.ContestOpen && (
        <div className="mt-8">
          <p className="text-[16px] text-primary-10 font-bold">
            submissions open {moment(submissionsOpen).format("MMMM Do, h:mm a")}
          </p>
        </div>
      )}

      <div className="mt-8">
        <div className="flex flex-col gap-5">
          <hr className="border-neutral-10" />
          {contestStatus !== ContestStatus.ContestOpen && !isContestLoading && (
            <ProposalStatistics contestStatus={contestStatus} />
          )}

          {!isContestLoading && !isListProposalsLoading && isContestSuccess && isListProposalsSuccess && (
            <div className={`animate-appear ${contestStatus !== ContestStatus.SubmissionOpen ? "mt-4" : "mt-0"}`}>
              <ListProposals />
            </div>
          )}
        </div>
      </div>
      <DialogModalSendProposal isOpen={isSubmitProposalModalOpen} setIsOpen={setIsSubmitProposalModalOpen} />
    </div>
  );
};

export default ContestTab;
