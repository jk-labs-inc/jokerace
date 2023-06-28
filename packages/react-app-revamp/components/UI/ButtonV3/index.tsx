import React from "react";
import { useAccount } from "wagmi";

type ButtonSize = "small" | "default" | "large";

interface ButtonV3Props {
  color?: string;
  size?: ButtonSize;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const sizes = {
  small: "w-24",
  default: "w-[120px] h-[32px]",
  large: "w-40 h-[40px]",
};

const ButtonV3: React.FC<ButtonV3Props> = ({ color = "yellow", size = "default", onClick, children }) => {
  const sizeClasses = sizes[size] || "";

  return (
    <button
      className={`${color} ${sizeClasses} text-[16px] tracking-tighter rounded-[10px] text-true-black font-bold`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonV3;
