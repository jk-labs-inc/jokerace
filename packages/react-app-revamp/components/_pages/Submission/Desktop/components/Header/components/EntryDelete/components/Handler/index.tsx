import SubmissionDeleteModal from "@components/_pages/Submission/components/Modals/Delete";
import { TrashIcon } from "@heroicons/react/24/outline";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useProposalIdStore from "@hooks/useProposalId/store";
import useDeleteProposal from "@hooks/useDeleteProposal";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const SubmissionPageDesktopHeaderEntryDeleteHandler = () => {
  const router = useRouter();
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const { deleteProposal, isLoading, isSuccess } = useDeleteProposal();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteProposal = async (proposalId: string) => {
    await deleteProposal([proposalId]);
  };

  useEffect(() => {
    if (isSuccess) {
      const contestRoute = `/contest/${contestConfig.chainName.toLowerCase()}/${contestConfig.address}`;
      router.push(contestRoute);
    }
  }, [isSuccess, contestConfig.chainName, contestConfig.address, router]);

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

export default SubmissionPageDesktopHeaderEntryDeleteHandler;
