import React, { useMemo } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export enum ButtonType {
  DEFAULT = "default",
  TX_ACTION = "txAction",
}

export enum ButtonSize {
  EXTRA_SMALL = "extraSmall",
  SMALL = "small",
  SMALL_LONG = "smallLong",
  DEFAULT = "default",
  DEFAULT_LONG = "defaultLong",
  LARGE = "large",
  EXTRA_LARGE = "extraLarge",
  EXTRA_LARGE_LONG = "extraLargeLong",
  FULL = "full",
}

interface ButtonProps {
  type?: ButtonType;
  colorClass?: string;
  size?: ButtonSize;
  textColorClass?: string;
  isDisabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

const sizeClasses = {
  [ButtonSize.EXTRA_SMALL]: "w-20 h-6",
  [ButtonSize.SMALL]: "w-24 h-6",
  [ButtonSize.SMALL_LONG]: "w-36 h-6",
  [ButtonSize.DEFAULT]: "w-[120px] h-8",
  [ButtonSize.DEFAULT_LONG]: "w-40 h-8",
  [ButtonSize.LARGE]: "w-40 h-[40px]",
  [ButtonSize.EXTRA_LARGE]: "w-[216px] h-[40px]",
  [ButtonSize.EXTRA_LARGE_LONG]: "w-[240px] h-[40px]",
  [ButtonSize.FULL]: "w-full h-[40px]",
};

const Button: React.FC<ButtonProps> = ({
  type = ButtonType.DEFAULT,
  colorClass = "yellow",
  size = ButtonSize.DEFAULT,
  textColorClass = "text-true-black",
  isDisabled,
  onClick,
  children,
}) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (type === ButtonType.TX_ACTION && !isConnected) {
      openConnectModal?.();
    } else {
      onClick?.(e);
    }
  };

  const disabledClasses = useMemo(() => (isDisabled ? "button-delete-state" : ""), [isDisabled]);

  return (
    <button
      className={`text-[16px] tracking-tighter rounded-[10px] font-bold ${disabledClasses} ${textColorClass} ${colorClass} ${sizeClasses[size]} `}
      onClick={handleOnClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default Button;
