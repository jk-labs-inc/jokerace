import useNavigateProposals from "@components/_pages/Submission/hooks/useNavigateProposals";
import CustomLink from "@components/UI/Link";
import { motion } from "motion/react";
import Link from "next/link";

const SubmissionPageDesktopEntryNavigation = () => {
  const { previousEntryUrl, nextEntryUrl } = useNavigateProposals();

  return (
    <div className="flex items-center gap-2">
      {previousEntryUrl && (
        <motion.div whileTap={{ scale: 0.97 }} style={{ willChange: "transform" }}>
          <CustomLink
            href={previousEntryUrl}
            scroll={false}
            className="flex items-center justify-center gap-2 bg-primary-2 text-neutral-11 text-[16px] font-bold rounded-[40px] w-[144px] h-8 group transform transition-transform duration-200 active:scale-95"
          >
            <div className="transition-transform duration-200 group-hover:-translate-x-1">
              <img src="/contest/previous-entry.svg" alt="prev-entry" width={16} height={14} className="mt-1" />
            </div>
            prev entry
          </CustomLink>
        </motion.div>
      )}
      {nextEntryUrl && (
        <motion.div whileTap={{ scale: 0.97 }} style={{ willChange: "transform" }}>
          <CustomLink
            href={nextEntryUrl}
            scroll={false}
            className="flex items-center justify-center gap-2 bg-primary-2 text-neutral-11 text-[16px] font-bold rounded-[40px] w-[144px] h-8 group transform transition-transform duration-200 active:scale-95"
          >
            next entry
            <div className="transition-transform duration-200 group-hover:translate-x-1">
              <img src="/contest/next-entry.svg" alt="next-entry" width={16} height={14} className="mt-[3px]" />
            </div>
          </CustomLink>
        </motion.div>
      )}
    </div>
  );
};

export default SubmissionPageDesktopEntryNavigation;
