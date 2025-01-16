import { useEffect, useRef, useState } from "react";

export const useLineCount = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    const calculateLines = () => {
      const element = elementRef.current;
      if (!element) return;

      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);
      const lineHeight = parseFloat(styles.lineHeight) || fontSize * 1.2; // fallback if lineHeight is "normal"
      const height = element.scrollHeight;

      const lines = Math.round(height / lineHeight);

      setLineCount(lines);
    };

    calculateLines();

    // recalculate on window resize
    window.addEventListener("resize", calculateLines);
    return () => window.removeEventListener("resize", calculateLines);
  }, []);

  return { elementRef, lineCount };
};
