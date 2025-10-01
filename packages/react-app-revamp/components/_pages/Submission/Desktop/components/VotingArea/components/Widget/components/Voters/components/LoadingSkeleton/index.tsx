import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";

const SubmissionPageDesktopVotingAreaWidgetVotersLoadingSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#706f78" highlightColor="#bb65ff" duration={1}>
      <div className="w-full flex-1 min-h-0">
        <div className="bg-gradient-voting-area-purple rounded-4xl pl-8 pr-12 py-4 w-full h-full flex flex-col">
          <div className="flex flex-col gap-6 min-h-0 flex-1">
            {/* Header with icon */}
            <div className="flex items-baseline gap-1 flex-shrink-0">
              <Image src="/entry/vote-ballot.svg" alt="voters" width={24} height={24} className="self-center" />
              <Skeleton width={120} height={24} />
              <Skeleton width={40} height={20} />
            </div>

            {/* Voters list skeleton */}
            <div className="flex flex-col gap-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex justify-between items-center pb-3 border-b border-neutral-10">
                  <div className="flex items-center gap-2">
                    <Skeleton circle height={32} width={32} />
                    <Skeleton width={100} height={16} />
                  </div>
                  <Skeleton width={50} height={16} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SubmissionPageDesktopVotingAreaWidgetVotersLoadingSkeleton;

