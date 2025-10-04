"use client";
import { motion } from "motion/react";

const SubmissionPageDesktopBodyCommentsLoadingSkeleton = () => {
  return (
    <div className="relative w-full pl-8 pt-4 pb-4 h-44 bg-gradient-voting-area-purple rounded-4xl overflow-hidden">
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

export default SubmissionPageDesktopBodyCommentsLoadingSkeleton;
