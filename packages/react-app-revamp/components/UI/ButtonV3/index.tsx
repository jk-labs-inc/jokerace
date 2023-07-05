import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useMemo } from "react";
import { useAccount } from "wagmi";

type ButtonSize = "extraSmall" | "small" | "default" | "large";

interface ButtonV3Props {
  type?: "default" | "txAction";
  color?: string;
  size?: ButtonSize;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const sizes = {
  extraSmall: "w-20 h-6",
  small: "w-24",
  default: "w-[120px] h-[32px]",
  large: "w-40 h-[40px]",
};

const ButtonV3: React.FC<ButtonV3Props> = ({
  type = "default",
  color = "yellow",
  size = "default",
  disabled,
  onClick,
  children,
}) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const sizeClasses = sizes[size] || "";

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type === "txAction") {
      if (!isConnected) {
        openConnectModal?.();
      } else {
        onClick?.(e);
      }
    } else {
      onClick?.(e);
    }
  };

  const isDisabled = useMemo<string>(() => {
    if (disabled) {
      console.log;
      return "opacity-50 pointer-events-none";
    }

    return "";
  }, [disabled]);

  return (
    <button
      className={`${color} ${sizeClasses} ${isDisabled} text-[16px] tracking-tighter rounded-[10px] text-true-black font-bold`}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

export default ButtonV3;
