import { generateUrlSubmissions } from "@helpers/share";
import useContestConfigStore from "@hooks/useContestConfig/store";
import useProposalIdStore from "@hooks/useProposalId/store";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import { motion } from "motion/react";

const SubmissionPageDesktopHeaderShare = () => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const proposalId = useProposalIdStore(useShallow(state => state.proposalId));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        url: generateUrlSubmissions(contestConfig.address, contestConfig.chainName, proposalId),
      });
    }
  };
  return (
    <motion.button
      className="flex items-center justify-center gap-2 w-[88px] bg-gradient-purple h-8 rounded-[40px]"
      whileTap={{ scale: 0.97 }}
      onClick={handleShare}
    >
      <p className="text-[16px] text-true-black font-bold">share</p>
      <Image src="/entry/share.svg" alt="share" width={16} height={16} />
    </motion.button>
  );
};

export default SubmissionPageDesktopHeaderShare;
