import React from "react";

type ButtonSize = "small" | "default" | "large";

interface ButtonV3Props {
  color?: string;
  size?: ButtonSize;
  children?: React.ReactNode;
  onClick?: () => void;
}

const sizes = {
  small: "w-24",
  default: "w-[120px]",
  large: "w-40",
};

const ButtonV3: React.FC<ButtonV3Props> = ({ color = "yellow", size = "default", onClick, children }) => {
  const sizeClasses = sizes[size] || "";

  return (
    <button
      className={`${color} ${sizeClasses} text-[16px] tracking-tighter p-2 rounded-[10px] text-true-black font-bold`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonV3;
