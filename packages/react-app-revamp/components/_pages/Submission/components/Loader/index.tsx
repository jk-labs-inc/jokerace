"use client";
import Loader from "@components/UI/Loader";
import { motion } from "motion/react";
import { useMediaQuery } from "react-responsive";

const ShimmerOverlay = () => (
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
);

const SubmissionLoader = () => {
  const isMobile = useMediaQuery({ maxWidth: 968 });

  if (isMobile) {
    return <Loader>Loading entry...</Loader>;
  }

  return (
    <div className="px-20 mt-8 animate-reveal">
      <div className="grid grid-cols-[50%_50%] xl:grid-cols-[60%_40%] gap-x-4 gap-y-8 items-center">
        {/* Header */}
        <div className="min-w-0">
          <div className="flex items-center gap-4 px-10">
            <div className="relative bg-primary-13 rounded-2xl h-8 w-40 overflow-hidden">
              <ShimmerOverlay />
            </div>
            <div className="relative bg-primary-13 rounded-[40px] h-10 w-64 overflow-hidden">
              <ShimmerOverlay />
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="min-w-0">
          <div className="relative bg-primary-13 rounded-[20px] h-10 w-52 overflow-hidden">
            <ShimmerOverlay />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 self-stretch">
          <div className="flex flex-col gap-4 bg-primary-1 rounded-4xl p-4">
            {/* Content area */}
            <div className="relative bg-primary-13 rounded-4xl h-[300px] overflow-hidden">
              <ShimmerOverlay />
            </div>
            {/* Comments section */}
            <div className="relative bg-gradient-voting-area-purple rounded-4xl h-44 overflow-hidden">
              <ShimmerOverlay />
            </div>
          </div>
        </div>

        {/* Voting Area */}
        <div className="min-w-0 self-stretch w-[480px]">
          <div className="flex flex-col gap-4 h-full">
            {/* Voting Widget */}
            <div className="relative bg-gradient-voting-area rounded-4xl flex-1 overflow-hidden">
              <ShimmerOverlay />
            </div>
            {/* Voters/Comments */}
            <div className="relative bg-gradient-voting-area-purple rounded-4xl flex-1 overflow-hidden">
              <ShimmerOverlay />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionLoader;
