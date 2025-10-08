import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface CommentsSkeletonProps {
  length: number;
  highlightColor?: string;
}

const CommentsSkeleton: FC<CommentsSkeletonProps> = ({ length, highlightColor = "#FFE25B" }) => {
  return (
    <SkeletonTheme baseColor="#706f78" highlightColor={highlightColor} duration={1}>
      <div className="flex flex-col gap-10">
        {Array.from({ length }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Skeleton circle={true} height={32} width={32} />
              <Skeleton width={100} height={16} className="mt-3" />
            </div>
            <Skeleton height={15} width={200} />
            <Skeleton height={50} width={660} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default CommentsSkeleton;
