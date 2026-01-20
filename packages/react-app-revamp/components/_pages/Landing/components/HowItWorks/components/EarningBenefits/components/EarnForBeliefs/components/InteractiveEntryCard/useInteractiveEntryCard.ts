import { useCallback, useState } from "react";
import { VoteParticle } from "./types";

const generateParticles = (batchId: number): VoteParticle[] => {
  const count = 5 + Math.floor(Math.random() * 3);
  const particles: VoteParticle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const distance = 25 + Math.random() * 35;

    particles.push({
      id: batchId * 1000 + i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 15,
      rotation: Math.random() * 360,
      scale: 0.4 + Math.random() * 0.4,
    });
  }

  return particles;
};

export const useInteractiveEntryCard = () => {
  const [voteCount, setVoteCount] = useState(1);
  const [particles, setParticles] = useState<VoteParticle[]>([]);
  const [clickId, setClickId] = useState(0);

  const handleUpvote = useCallback(() => {
    const newClickId = clickId + 1;
    setClickId(newClickId);
    setVoteCount(prev => prev + 1);

    const newParticles = generateParticles(newClickId);
    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id >= newClickId * 1000));
    }, 350);
  }, [clickId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleUpvote();
      }
    },
    [handleUpvote],
  );

  return {
    voteCount,
    particles,
    clickId,
    handleUpvote,
    handleKeyDown,
  };
};
