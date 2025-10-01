import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SubmissionPageDesktopHeaderLoadingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#bb65ff" duration={1}>
      <div className="flex items-center gap-4 pl-10">
        {/* Votes skeleton */}
        <Skeleton width={160} height={32} borderRadius={16} />

        {/* Navigation buttons skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton width={120} height={40} borderRadius={40} />
          <Skeleton width={120} height={40} borderRadius={40} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SubmissionPageDesktopHeaderLoadingSkeleton;
