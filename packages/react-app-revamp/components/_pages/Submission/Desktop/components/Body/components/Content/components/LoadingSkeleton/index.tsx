import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SubmissionPageDesktopBodyContentLoadingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#bb65ff" duration={1}>
      <div className="bg-primary-13 rounded-4xl flex flex-col p-8 gap-6">
        {/* Title skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton width="80%" height={40} />
          <Skeleton width="60%" height={40} />
        </div>

        {/* Author info skeleton */}
        <div className="flex items-center gap-4 py-4 border-y border-neutral-10">
          <Skeleton circle width={48} height={48} />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton width={150} height={16} />
            <Skeleton width={200} height={14} />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="flex flex-col gap-3">
          <Skeleton width="100%" height={20} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="100%" height={20} />
          <Skeleton width="95%" height={20} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SubmissionPageDesktopBodyContentLoadingSkeleton;
