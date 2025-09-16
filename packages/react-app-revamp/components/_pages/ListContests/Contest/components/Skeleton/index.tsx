import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const ContestSkeleton = () => (
  <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1}>
    <div className="flex flex-col items-start md:grid md:grid-cols-[60px_300px_auto_1fr] md:items-center gap-4 md:gap-8 py-4 md:py-6 px-2 md:px-4 border-t-primary-2 border-t">
      <div className="w-6 h-6">
        <Skeleton circle width={24} height={24} />
      </div>

      <div className="w-full">
        <Skeleton height={16} width="80%" />
        <Skeleton height={16} width="60%" />
      </div>

      <div className="flex flex-col items-start">
        <Skeleton height={16} width={120} />
        <Skeleton height={14} width={80} />
      </div>

      <div className="md:justify-self-end">
        <Skeleton height={16} width={80} />
        <Skeleton height={14} width={60} />
      </div>
    </div>
  </SkeletonTheme>
);

export default ContestSkeleton;
