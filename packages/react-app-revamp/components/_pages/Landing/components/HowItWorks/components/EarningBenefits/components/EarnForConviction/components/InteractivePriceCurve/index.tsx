import { motion } from "motion/react";
import { FC } from "react";
import { usePriceCurve } from "./usePriceCurve";

const InteractivePriceCurve: FC = () => {
  const { scaledPath, dotPosition, chartSize, margin } = usePriceCurve();

  return (
    <div className="relative w-44 h-44 rounded-xl border border-primary-5 bg-true-black p-2">
      <svg width={chartSize} height={chartSize} className="absolute inset-0">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <path
            d={scaledPath}
            stroke="#BB65FF"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            style={{ filter: "drop-shadow(0 0 6px rgba(187, 101, 255, 0.5))" }}
          />

          <defs>
            <radialGradient id="landing-dot-gradient" cx="50%" cy="50%" r="50%">
              <motion.stop
                offset="0%"
                stopColor="#BB65FF"
                animate={{
                  offset: ["0%", "0%", "0%", "0%", "0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.6, 0.65, 0.75, 1],
                }}
              />
              <motion.stop
                stopColor="#BB65FF"
                animate={{
                  offset: ["35%", "20%", "35%", "35%", "35%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.6, 0.65, 0.75, 1],
                }}
              />
              <motion.stop
                offset="100%"
                stopColor="#78FFC6"
                animate={{
                  stopColor: ["#78FFC6", "#78FFC6", "#E5E5E5", "#E5E5E5", "#78FFC6"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.6, 0.65, 0.75, 1],
                }}
              />
            </radialGradient>
          </defs>

          <motion.circle
            cx={dotPosition.x}
            cy={dotPosition.y}
            r={8}
            fill="url(#landing-dot-gradient)"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              filter: "drop-shadow(0 0 8px rgba(120, 255, 198, 0.6))",
              transformOrigin: `${dotPosition.x}px ${dotPosition.y}px`,
            }}
          />
        </g>
      </svg>
    </div>
  );
};

export default InteractivePriceCurve;
