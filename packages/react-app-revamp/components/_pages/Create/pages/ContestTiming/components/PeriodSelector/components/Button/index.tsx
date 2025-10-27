import { motion } from "motion/react";
import { FC } from "react";

interface PeriodSelectorButtonProps {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const PeriodSelectorButton: FC<PeriodSelectorButtonProps> = ({ children, isSelected, onClick }) => {
  return (
    <button onClick={onClick} className="relative w-14 h-8 rounded-4xl flex items-center justify-center" type="button">
      <motion.span
        initial={false}
        animate={{
          opacity: isSelected ? 1 : 0.5,
        }}
        className={`relative z-10 text-[20px] ${isSelected ? "text-true-black" : "text-primary-5"}`}
        style={{ willChange: "opacity" }}
      >
        {children}
      </motion.span>
      {isSelected && (
        <motion.div
          layoutId="selected-period"
          className="absolute inset-0 rounded-4xl bg-neutral-11 shadow-period-selector"
          style={{
            zIndex: 1,
            willChange: "transform",
          }}
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.6,
          }}
        />
      )}
    </button>
  );
};

export default PeriodSelectorButton;
