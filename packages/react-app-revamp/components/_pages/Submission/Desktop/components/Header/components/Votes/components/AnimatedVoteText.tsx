import AnimatedBlinkText from "@components/UI/AnimatedBlinkText";

interface AnimatedVoteTextProps {
  children: React.ReactNode;
  votes: number;
}

const AnimatedVoteText = ({ children, votes }: AnimatedVoteTextProps) => {
  return (
    <AnimatedBlinkText value={votes} className="text-positive-14 text-base font-bold">
      {children}
    </AnimatedBlinkText>
  );
};

export default AnimatedVoteText;
