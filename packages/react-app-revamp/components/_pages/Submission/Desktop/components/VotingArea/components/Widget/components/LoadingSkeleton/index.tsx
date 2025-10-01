import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SubmissionPageDesktopVotingAreaWidgetLoadingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#bb65ff" duration={1}>
      <div className="flex flex-col gap-4">
        {/* Voting type toggle skeleton */}
        <div className="flex gap-2">
          <Skeleton width={120} height={48} borderRadius={40} />
          <Skeleton width={120} height={48} borderRadius={40} />
        </div>

        {/* Charge display skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton width="100%" height={24} />
          <Skeleton width="80%" height={20} />
        </div>

        {/* Input field skeleton */}
        <Skeleton width="100%" height={56} borderRadius={16} />

        {/* Cost display skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton width={100} height={20} />
          <Skeleton width={80} height={24} />
        </div>

        {/* Submit button skeleton */}
        <Skeleton width="100%" height={48} borderRadius={40} />
      </div>
    </SkeletonTheme>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetLoadingSkeleton;
