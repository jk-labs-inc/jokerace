import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { FC, useCallback, useState } from "react";
import { motion } from "motion/react";
import { throttle } from "lodash";

interface RefreshButtonProps {
  onRefresh: () => void;
  throttleTime?: number;
  refreshAnimationDuration?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RefreshButton: FC<RefreshButtonProps> = ({
  onRefresh,
  throttleTime = 2000,
  refreshAnimationDuration = 1000,
  size = "sm",
  className = "",
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  const handleRefreshThrottled = useCallback(
    throttle(
      () => {
        setIsRefreshing(true);
        onRefresh();
        setTimeout(() => setIsRefreshing(false), refreshAnimationDuration);

        setIsOnCooldown(true);
        setTimeout(() => setIsOnCooldown(false), throttleTime);
      },
      throttleTime,
      { leading: true, trailing: false },
    ),
    [onRefresh, refreshAnimationDuration, throttleTime],
  );

  const iconSizeClass = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  return (
    <motion.button
      onClick={handleRefreshThrottled}
      animate={{
        rotate: isRefreshing ? 360 : 0,
        opacity: isOnCooldown && !isRefreshing ? 0.75 : 1,
        scale: isOnCooldown && !isRefreshing ? 0.99 : 1,
      }}
      transition={{
        duration: isRefreshing ? refreshAnimationDuration / 1000 : 0.3,
        ease: "easeInOut",
      }}
      style={{ willChange: "transform, opacity" }}
      aria-label="refresh"
      disabled={isOnCooldown}
      className={className}
    >
      <ArrowPathIcon
        className={`${iconSizeClass} text-neutral-11 hover:text-neutral-12 transition-all duration-300 ease-in-out ${
          isOnCooldown && !isRefreshing ? "text-neutral-9" : ""
        }`}
      />
    </motion.button>
  );
};

export default RefreshButton;
