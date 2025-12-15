import { Ticker as MotionTicker } from "motion-plus/react";
import { ReactNode, useState } from "react";

interface TickerProps {
  items: ReactNode[];
  className?: string;
  velocity?: number;
  axis?: "x" | "y";
  gap?: number;
  pauseOnHover?: boolean;
}

const Ticker = ({ items, className = "", velocity = 100, axis = "x", gap = 16, pauseOnHover = true }: TickerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const gapStyle = axis === "x" ? { marginRight: `${gap}px` } : { marginBottom: `${gap}px` };
  const currentVelocity = pauseOnHover && isHovered ? 0 : velocity;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const wrappedItems = items.map((item, index) => (
    <div key={index} style={gapStyle} className="flex items-center shrink-0">
      {item}
    </div>
  ));

  return (
    <div className={`overflow-hidden ${className}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <MotionTicker items={wrappedItems} velocity={currentVelocity} axis={axis} />
    </div>
  );
};

export default Ticker;
