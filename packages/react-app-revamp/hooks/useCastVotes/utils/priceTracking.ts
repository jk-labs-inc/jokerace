import { useRef, useEffect } from "react";

export const usePriceTracking = (currentPrice: string) => {
  const priceRef = useRef<{
    initial: string | null;
    current: string;
  }>({
    initial: null,
    current: currentPrice,
  });

  useEffect(() => {
    if (priceRef.current.initial === null) {
      priceRef.current.initial = currentPrice;
    }
    priceRef.current.current = currentPrice;
  }, [currentPrice]);

  const startNewVotingSession = () => {
    priceRef.current.initial = priceRef.current.current;
  };

  const getPrices = () => ({
    initialPrice: priceRef.current.initial,
    currentPrice: priceRef.current.current,
  });

  return { startNewVotingSession, getPrices };
};
