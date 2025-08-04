import { delay, wrap } from "motion";
import { Typewriter } from "motion-plus/react";
import { useState } from "react";

interface TypewriterCyclerProps {
  words: string[];
  as?: string;
  delayBetweenWords?: number;
  className?: string;
  style?: React.CSSProperties;
  onWordComplete?: (word: string, index: number) => void;
}

const TypewriterCycler = ({
  words,
  as = "span",
  delayBetweenWords = 1,
  className,
  style,
  onWordComplete,
}: TypewriterCyclerProps) => {
  const [wordIndex, setWordIndex] = useState(0);

  const handleComplete = () => {
    const currentWord = words[wordIndex];
    onWordComplete?.(currentWord, wordIndex);

    delay(() => {
      setWordIndex(wrap(0, words.length, wordIndex + 1));
    }, delayBetweenWords);
  };

  return (
    <Typewriter
      as={as}
      onComplete={handleComplete}
      className={className}
      style={{
        display: "inline-block",
        ...style,
      }}
    >
      {words[wordIndex]}
    </Typewriter>
  );
};

export default TypewriterCycler;
