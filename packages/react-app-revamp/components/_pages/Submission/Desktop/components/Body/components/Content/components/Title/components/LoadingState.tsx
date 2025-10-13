import { motion } from "motion/react";

const LoadingState = () => {
  return (
    <div className="relative bg-gradient-entry-title rounded-t-4xl overflow-hidden">
      <div className="pl-8 pr-4 py-6"></div>
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

export default LoadingState;
