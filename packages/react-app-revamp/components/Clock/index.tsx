import React, { useEffect, useRef } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import ChangingProgressProvider from "./Progress";

interface ClockProps {
  type: "hours" | "minutes";
  value: number;
}

const Clock: React.FC<ClockProps> = ({ type, value }) => {
  const needleRef = useRef<HTMLDivElement | null>(null);

  const getDuration = () => {
    switch (type) {
      case "hours":
        return 3600 * value;
      case "minutes":
        return 60 * value;
      default:
        return value;
    }
  };

  useEffect(() => {
    const durationInSeconds = getDuration();
    const endTime = new Date().getTime() + durationInSeconds * 1000;
    let degree = 0;

    const animate = () => {
      if (needleRef.current) {
        const currentTime = new Date().getTime();
        const timePassed = endTime - currentTime;
        const progress = 1 - timePassed / (durationInSeconds * 1000);
        degree = progress * 360 * value;
        needleRef.current.style.transform = `translateX(-50%) rotate(${degree}deg)`;
      }

      if (degree < 360 * value) {
        requestAnimationFrame(animate);
      }
    };

    animate();
    // Cleanup function to stop the animation when the component is unmounted
    return () => {
      degree = 360 * value;
    };
  }, [type, value]);

  return (
    <ChangingProgressProvider interval={1000} values={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}>
      {percentage => (
        <CircularProgressbar
          className="w-16 h-16"
          value={percentage}
          maxValue={10}
          text={`1 min left`}
          styles={buildStyles({
            pathTransitionDuration: 0.15,
            pathColor: "#ffef5c",
            textColor: "#ffef5c",
            strokeLinecap: "round",
          })}
        />
      )}
    </ChangingProgressProvider>
  );
};
export default Clock;
