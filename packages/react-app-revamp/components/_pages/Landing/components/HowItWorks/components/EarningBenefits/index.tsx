import { motion, Variants } from "motion/react";
import EarnForBeliefs from "./components/EarnForBeliefs";
import EarnForConviction from "./components/EarnForConviction";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const dividerVariants: Variants = {
  hidden: { opacity: 0, scaleY: 0 },
  visible: {
    opacity: 1,
    scaleY: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: 0.2,
    },
  },
};

const LandingPageHowItWorksEarningBenefits = () => {
  return (
    <motion.div
      className="flex flex-col gap-8 md:flex-row md:gap-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="w-full md:w-1/2" style={{ willChange: "transform" }}>
        <EarnForBeliefs />
      </motion.div>
      <motion.div
        className="hidden md:block bg-neutral-10 w-px h-auto origin-top"
        variants={dividerVariants}
        style={{ willChange: "transform" }}
      />
      <motion.div variants={itemVariants} className="w-full md:w-1/2" style={{ willChange: "transform" }}>
        <EarnForConviction />
      </motion.div>
    </motion.div>
  );
};

export default LandingPageHowItWorksEarningBenefits;
