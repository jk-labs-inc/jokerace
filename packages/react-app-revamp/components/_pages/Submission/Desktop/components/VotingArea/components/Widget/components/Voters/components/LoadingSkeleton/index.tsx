"use client";
import { motion } from "motion/react";

const SubmissionPageDesktopVotingAreaWidgetVotersLoadingSkeleton = () => {
  return (
    <div className="w-full flex-1 min-h-0">
      <div className="relative bg-gradient-voting-area-purple rounded-4xl pl-8 pr-12 py-4 w-full h-full overflow-hidden">
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
    </div>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetVotersLoadingSkeleton;
