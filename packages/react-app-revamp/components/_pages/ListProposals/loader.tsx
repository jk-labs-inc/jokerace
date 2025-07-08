import { motion } from "motion/react";
import { forwardRef } from "react";

const ListProposalsLoader = forwardRef<HTMLDivElement, {}>((_, ref) => {
  return (
    <div ref={ref} className="flex justify-center items-center p-10 rounded-lg">
      <motion.div
        className="w-12 h-12 rounded-full border-4 border-neutral-10 border-t-secondary-11"
        style={{ willChange: "transform" }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
});

ListProposalsLoader.displayName = "ListProposalsLoader";

export default ListProposalsLoader;
