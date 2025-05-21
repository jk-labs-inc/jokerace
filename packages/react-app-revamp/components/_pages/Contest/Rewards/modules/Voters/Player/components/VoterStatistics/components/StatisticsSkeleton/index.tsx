import { FC } from "react";
import Skeleton from "react-loading-skeleton";

const StatisticsSkeleton: FC = () => (
  <div className="flex flex-col w-full text-neutral-9 max-w-72 gap-2">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className={`flex justify-between items-center text-[16px] font-normal ${i !== 4 ? "border-b border-primary-2 pb-2" : ""}`}
      >
        <span>
          <Skeleton width={180} height={16} baseColor="#6A6A6A" highlightColor="#BB65FF" duration={1} />
        </span>
        <span>
          <Skeleton width={80} height={16} baseColor="#6A6A6A" highlightColor="#BB65FF" duration={1} />
        </span>
      </div>
    ))}
  </div>
);

export default StatisticsSkeleton;
