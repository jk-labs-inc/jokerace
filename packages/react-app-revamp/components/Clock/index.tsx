import React, { useEffect, useState, useRef } from "react";

interface CircularProgressBarProps {
  value: number;
  type: "hours" | "minutes";
  size: number;
  strokeWidth: number;
  color?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ value, type, size, strokeWidth, color }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [remainingValue, setRemainingValue] = useState(value);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const duration = type === "hours" ? 3600000 : 60000; // one hour or one minute in ms

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedProgress / 100) * circumference;

  const animateProgress = (timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }

    const elapsedTime = timestamp - startTimeRef.current;
    const progressFraction = elapsedTime / duration;
    const newProgress = progressFraction * 100;

    setAnimatedProgress(Math.min(newProgress, 100));

    if (newProgress < 100) {
      frameRef.current = requestAnimationFrame(animateProgress);
    } else {
      startTimeRef.current = null;
      setAnimatedProgress(0);
      if (remainingValue > 0) {
        setRemainingValue(remainingValue - 1);
      }
    }
  };

  useEffect(() => {
    if (remainingValue > 0) {
      frameRef.current = requestAnimationFrame(animateProgress);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [remainingValue, duration]);

  const angle = 2 * Math.PI * (animatedProgress / 100) - Math.PI / 2;
  const dotX = size / 2 + radius * Math.cos(angle);
  const dotY = size / 2 + radius * Math.sin(angle);

  return (
    <div>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="lightgray" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`${color}`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
        <circle cx={dotX} cy={dotY} r={strokeWidth} fill={`${color}`} />
      </svg>
      <div className={`text-[11px] text-center text-[${color}] -mt-[41px]`}>
        {remainingValue}
        {type === "hours" ? "hrs" : "m"} <br />
        left
      </div>
    </div>
  );
};

export default CircularProgressBar;
