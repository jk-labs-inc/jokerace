import { FC } from "react";

interface ChargeInfoContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ChargeInfoContainer: FC<ChargeInfoContainerProps> = ({ children, className }) => {
  return <div className={`flex justify-between text-neutral-9 text-[16px] ${className}`}>{children}</div>;
};

export default ChargeInfoContainer;
