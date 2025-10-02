import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface AnimatedVoteCountProps {
  children: React.ReactNode;
  votes: number;
  className?: string;
}

const AnimatedVoteCount = ({ children, votes, className }: AnimatedVoteCountProps) => {
  const previousVotes = useRef<number>(votes);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousVotes.current = votes;
    }
  }, [votes]);

  const hasChanged = previousVotes.current !== votes;

  useEffect(() => {
    if (hasChanged) {
      previousVotes.current = votes;
    }
  }, [votes, hasChanged]);

  return (
    <motion.p
      key={votes}
      className={className}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.p>
  );
};

export default AnimatedVoteCount;
