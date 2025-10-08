import { useEffect, useState, RefObject } from "react";

interface UseScrollFadeOptions {
  topFadePercentage?: number;
  bottomFadePercentage?: number;
}

interface UseScrollFadeReturn {
  shouldApplyFade: boolean;
  maskImageStyle: string | undefined;
}

/**
 * Custom hook to apply dynamic fade effects at scroll container edges
 * @param scrollContainerRef - Reference to the scrollable container
 * @param itemsCount - Number of items in the list
 * @param dependencies - Array of dependencies to trigger overflow recalculation
 * @param options - Configuration options
 * @returns Object containing shouldApplyFade flag and maskImageStyle
 */
const useScrollFade = (
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  itemsCount: number,
  dependencies: any[] = [],
  options: UseScrollFadeOptions = {},
): UseScrollFadeReturn => {
  const { topFadePercentage = 10, bottomFadePercentage = 10 } = options;
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  // Check if container has overflow
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setHasOverflow(scrollHeight > clientHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, dependencies);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        setIsScrolledToTop(scrollTop === 0);
        setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 1);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => container?.removeEventListener("scroll", handleScroll);
  }, dependencies);

  const shouldApplyFade = itemsCount >= 2 && hasOverflow;

  const getMaskImage = (): string | undefined => {
    if (!shouldApplyFade) return undefined;

    const topFade = isScrolledToTop ? "black 0%" : `transparent 0%, black ${topFadePercentage}%`;
    const bottomFade = isScrolledToBottom ? "black 100%" : `black ${100 - bottomFadePercentage}%, transparent 100%`;

    return `linear-gradient(to bottom, ${topFade}, ${bottomFade})`;
  };

  return {
    shouldApplyFade,
    maskImageStyle: getMaskImage(),
  };
};

export default useScrollFade;
