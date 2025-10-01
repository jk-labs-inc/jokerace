import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";

const SubmissionPageDesktopBodyCommentsLoadingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#bb65ff" duration={1}>
      <div className="w-full pl-8 pt-4 pb-4 h-44 bg-gradient-voting-area-purple rounded-4xl">
        <div className="flex items-baseline gap-1 flex-shrink-0">
          <Image src="/entry/comment.svg" alt="comments" width={24} height={24} className="self-center mt-1" />
          <Skeleton width={150} height={24} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SubmissionPageDesktopBodyCommentsLoadingSkeleton;

