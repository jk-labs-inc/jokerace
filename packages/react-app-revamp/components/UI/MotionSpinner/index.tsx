import { FC } from "react";
import { motion } from "motion/react";

interface MotionSpinnerProps {
  size?: number;
  borderWidth?: number;
  theme?: "light" | "dark" | "auto";
  customColor?: string;
}

const MotionSpinner: FC<MotionSpinnerProps> = ({ size = 24, borderWidth = 2, theme = "auto", customColor }) => {
  const themeColors = {
    light: {
      border: "rgba(229, 229, 229, 0.2)",
      spinner: "#E5E5E5",
    },
    dark: {
      border: "rgba(0, 0, 0, 0.2)",
      spinner: "#333333",
    },
  };

  const borderColor = customColor
    ? `rgba(${customColor}, 0.2)`
    : theme === "auto"
    ? "rgba(229, 229, 229, 0.2)"
    : themeColors[theme].border;

  const spinnerColor = customColor || (theme === "auto" ? "var(--text-color, #E5E5E5)" : themeColors[theme].spinner);

  return (
    <div className="flex items-center justify-center">
      <motion.div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          border: `${borderWidth}px solid ${borderColor}`,
          borderTopColor: spinnerColor,
          willChange: "transform",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default MotionSpinner;
