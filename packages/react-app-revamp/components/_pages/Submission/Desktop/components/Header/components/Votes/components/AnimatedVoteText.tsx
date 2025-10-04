import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface AnimatedVoteTextProps {
  children: React.ReactNode;
  votes: number;
}

const AnimatedVoteText = ({ children, votes }: AnimatedVoteTextProps) => {
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
    <motion.span
      key={votes}
      className="text-positive-14 text-base font-bold"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
};

export default AnimatedVoteText;
