import { TotalRewardInfo } from "@hooks/useReleasableRewards";
import { FC, useEffect, useState } from "react";
import { formatUnits } from "viem";

interface TotalRewardsInfoProps {
  totalRewards: TotalRewardInfo[];
}

const TotalRewardsInfo: FC<TotalRewardsInfoProps> = ({ totalRewards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (totalRewards.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % totalRewards.length;
          setAnimate(true);
          setTimeout(() => setAnimate(false), 1000);
          return nextIndex;
        });
      }, 1500);

      return () => clearInterval(interval);
    } else if (totalRewards.length === 1) {
      setCurrentIndex(0);
    }
  }, [totalRewards]);

  const currentReward = totalRewards[currentIndex];

  return (
    <div className="w-fit max-w-full">
      <div className="flex h-8 px-2 md:px-4 items-center bg-transparent border border-neutral-10 rounded-[10px] text-[16px] font-bold text-positive-11">
        <div className={`flex items-center gap-1 ${animate ? "animate-reveal" : ""}`}>
          <p>{formatUnits(currentReward.totalAmount, currentReward.decimals)}</p>{" "}
          <p className="uppercase">${currentReward.symbol}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalRewardsInfo;
