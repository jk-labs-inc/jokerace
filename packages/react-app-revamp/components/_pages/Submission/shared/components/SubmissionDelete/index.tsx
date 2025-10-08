import SubmissionDeleteModal from "@components/_pages/Submission/components/Modals/Delete";
import useContestVoteTimer, { VotingStatus } from "@components/_pages/Submission/hooks/useContestVoteTimer";
import { useSubmissionPageStore } from "@components/_pages/Submission/store";
import { TrashIcon } from "@heroicons/react/24/outline";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import useProposalIdStore from "@hooks/useProposalId/store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useShallow } from "zustand/shallow";

const SubmissionDelete = () => {
  const router = useRouter();
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const { contestDetails, voteTimings } = useSubmissionPageStore(useShallow(state => state));
  const { votingStatus } = useContestVoteTimer({
    voteStart: voteTimings?.voteStart ?? null,
    contestDeadline: voteTimings?.contestDeadline ?? null,
  });
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const { deleteProposal, isLoading, isSuccess, canDeleteProposal } = useDeleteProposal();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { address } = useAccount();

  const handleDeleteProposal = async (proposalId: string) => {
    await deleteProposal([proposalId]);
  };

  useEffect(() => {
    if (isSuccess) {
      const contestRoute = `/contest/${contestConfig.chainName.toLowerCase()}/${contestConfig.address}`;
      router.push(contestRoute);
    }
  }, [isSuccess, contestConfig.chainName, contestConfig.address, router]);

  if (
    (address !== contestDetails.author && address !== proposalId) ||
    votingStatus === VotingStatus.VotingOpen ||
    votingStatus === VotingStatus.VotingClosed
  ) {
    return null;
  }

  return (
    <div>
      <motion.button
        whileTap={!isLoading ? { scale: 0.97 } : undefined}
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={isLoading}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <TrashIcon className="h-6 w-6 text-negative-11" />
      </motion.button>

      <SubmissionDeleteModal
        isDeleteProposalModalOpen={isDeleteModalOpen}
        setIsDeleteProposalModalOpen={setIsDeleteModalOpen}
        onClick={() => handleDeleteProposal(proposalId)}
      />
    </div>
  );
};

export default SubmissionDelete;
