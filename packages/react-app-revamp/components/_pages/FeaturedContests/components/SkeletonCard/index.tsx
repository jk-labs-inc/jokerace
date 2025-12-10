import Skeleton from "react-loading-skeleton";

const SkeletonCard = () => {
  return (
    <div className="flex flex-col gap-2">
      {/* Card Container */}
      <div
        className="w-80 h-64 rounded-lg border border-primary-2 overflow-hidden relative"
        style={{ background: "linear-gradient(155deg, #381D4C -2.14%, #000 33.85%)" }}
      >
        <div className="relative h-full px-4 pb-2 flex flex-col justify-end gap-2">
          {/* ContestState skeleton */}
          <Skeleton width={100} height={16} baseColor="#212121" highlightColor="#100816" borderRadius={4} />
          {/* ContestTitle skeleton */}
          <Skeleton width={200} height={28} baseColor="#212121" highlightColor="#100816" borderRadius={4} />
        </div>
      </div>
      {/* ContestTiming skeleton */}
      <div className="pl-4">
        <Skeleton width={120} height={14} baseColor="#212121" highlightColor="#100816" borderRadius={4} />
      </div>
    </div>
  );
};

export default SkeletonCard;
