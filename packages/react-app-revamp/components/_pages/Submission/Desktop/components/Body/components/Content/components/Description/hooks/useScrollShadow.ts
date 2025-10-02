import { useState, useEffect, useRef } from "react";

interface UseScrollShadowReturn {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  showTopShadow: boolean;
  showBottomShadow: boolean;
  hasScrollableContent: boolean;
}

const SCROLL_THRESHOLD = 10;

export const useScrollShadow = (content: string): UseScrollShadowReturn => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);
  const [hasScrollableContent, setHasScrollableContent] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // Check if there's actually scrollable content
    const isScrollable = scrollHeight > clientHeight + SCROLL_THRESHOLD;
    setHasScrollableContent(isScrollable);

    if (!isScrollable) {
      setShowTopShadow(false);
      setShowBottomShadow(false);
      return;
    }

    // Show top shadow when scrolled down (with small threshold)
    setShowTopShadow(scrollTop > 5);

    // Show bottom shadow when there's more content below (with threshold)
    setShowBottomShadow(scrollTop < scrollHeight - clientHeight - SCROLL_THRESHOLD);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    handleScroll();

    scrollElement.addEventListener("scroll", handleScroll);

    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(scrollElement);

    const images = scrollElement.querySelectorAll("img");
    const handleImageLoad = () => {
      setTimeout(handleScroll, 50);
    };

    images.forEach(img => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
      }
    });

    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      images.forEach(img => {
        img.removeEventListener("load", handleImageLoad);
      });
      clearTimeout(timeoutId);
    };
  }, [content]);

  return {
    scrollRef,
    showTopShadow,
    showBottomShadow,
    hasScrollableContent,
  };
};
