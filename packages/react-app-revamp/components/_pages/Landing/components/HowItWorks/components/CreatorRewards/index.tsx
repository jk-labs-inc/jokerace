import { motion, Variants } from "motion/react";
import CreateContests from "./components/CreateContests";
import FundsDistribution from "./components/FundsDistribution";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

const LandingPageHowItWorksCreatorRewards = () => {
  return (
    <motion.div
      className="flex flex-col gap-8 md:flex-row md:gap-12 md:items-start"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="w-full md:w-1/2" style={{ willChange: "transform" }}>
        <CreateContests />
      </motion.div>
      <motion.div
        variants={itemVariants}
        className="hidden md:block md:w-1/2"
        style={{ willChange: "transform" }}
      >
        <FundsDistribution />
      </motion.div>
    </motion.div>
  );
};

export default LandingPageHowItWorksCreatorRewards;
