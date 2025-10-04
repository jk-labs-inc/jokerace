import { motion } from "motion/react";

const SubmissionPageDesktopVotingAreaWidgetLoadingSkeleton = () => {
  return (
    <div className="relative bg-gradient-voting-area rounded-4xl pl-8 pt-4 pb-6 pr-12 min-h-[400px] overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetLoadingSkeleton;
