import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AnimatedBlinkTextProps {
  children: React.ReactNode;
  value: any;
  className?: string;
  duration?: number;
  blinkColor?: string;
}

const AnimatedBlinkText = ({ children, value, className = "", duration = 0.4, blinkColor }: AnimatedBlinkTextProps) => {
  const previousValue = useRef<any>(value);
  const isFirstRender = useRef(true);
  const [showBlinkColor, setShowBlinkColor] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousValue.current = value;
      return;
    }

    if (previousValue.current !== value && blinkColor) {
      setShowBlinkColor(true);
      const timer = setTimeout(() => {
        setShowBlinkColor(false);
      }, duration * 1000);

      previousValue.current = value;
      return () => clearTimeout(timer);
    }

    previousValue.current = value;
  }, [value, blinkColor, duration]);

  return (
    <motion.span
      key={value}
      className={className}
      style={showBlinkColor && blinkColor ? { color: blinkColor } : undefined}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{
        duration,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
};

export default AnimatedBlinkText;
