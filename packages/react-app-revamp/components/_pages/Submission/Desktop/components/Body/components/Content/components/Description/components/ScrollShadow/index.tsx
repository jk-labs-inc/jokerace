import { FC } from "react";
import { motion } from "motion/react";

interface ScrollShadowProps {
  showTopShadow: boolean;
  showBottomShadow: boolean;
}

const ScrollShadow: FC<ScrollShadowProps> = ({ showTopShadow, showBottomShadow }) => {
  return (
    <>
      <motion.div
        className="absolute top-0 left-8 right-4 h-6 bg-gradient-to-b from-primary-2 to-transparent pointer-events-none z-10"
        style={{ willChange: "opacity" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showTopShadow ? 0.9 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-primary-2 to-transparent pointer-events-none z-10 rounded-b-4xl"
        style={{ willChange: "opacity" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showBottomShadow ? 0.9 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </>
  );
};

export default ScrollShadow;
