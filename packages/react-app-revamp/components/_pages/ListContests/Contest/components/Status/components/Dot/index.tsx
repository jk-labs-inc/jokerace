import { FC } from "react";

interface DotProps {
  color: "green" | "pink" | "purple" | "yellow";
}

const Dot: FC<DotProps> = ({ color }) => {
  const colorClasses = {
    green: "bg-positive-11",
    pink: "bg-negative-11",
    purple: "bg-secondary-11",
    yellow: "bg-primary-11",
  };

  if (color === "green") {
    return (
      <span className="relative flex h-2 w-2 mt-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive-10 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-positive-11"></span>
      </span>
    );
  }

  return <div className={`w-2 h-2 mt-1 rounded-full ${colorClasses[color]}`} />;
};

export default Dot;
