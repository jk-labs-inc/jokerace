import { FC, ReactNode } from "react";

interface TickerTextProps {
  children: ReactNode;
  className?: string;
}

const TickerText: FC<TickerTextProps> = ({ children, className = "" }) => {
  return (
    <span
      className={`text-positive-11 text-2xl font-sabo-filled uppercase ${className}`}
      style={{
        WebkitTextStroke: "1px #BB65FF",
        textShadow: "-2px 2px 6px #BB65FF",
      }}
    >
      {children}
    </span>
  );
};

export default TickerText;
