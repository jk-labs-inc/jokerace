import { EntryPreview } from "@hooks/useDeployContest/store";
import { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface ListProposalsSkeletonProps {
  enabledPreview: EntryPreview | null;
  highlightColor: string;
  count?: number;
}

const ProposalSkeleton = ({ highlightColor, children }: { highlightColor: string; children: React.ReactNode }) => (
  <SkeletonTheme baseColor="#141414" highlightColor={highlightColor} duration={1}>
    {children}
  </SkeletonTheme>
);

const ListProposalsSkeleton: FC<ListProposalsSkeletonProps> = ({ enabledPreview, highlightColor, count }) => {
  switch (enabledPreview) {
    case EntryPreview.TITLE:
      return (
        <ProposalSkeleton highlightColor={highlightColor}>
          <Skeleton
            borderRadius={16}
            count={count}
            className="flex flex-col w-full h-24 md:h-[88px] animate-appear rounded-2xl mt-3"
          />
        </ProposalSkeleton>
      );
    case EntryPreview.IMAGE:
    case EntryPreview.IMAGE_AND_TITLE:
    case EntryPreview.TWEET:
      return (
        <ProposalSkeleton highlightColor={highlightColor}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(count || 1)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  borderRadius={16}
                  className="flex flex-col w-full h-52 animate-appear rounded-2xl"
                />
              ))}
          </div>
        </ProposalSkeleton>
      );
    default:
      return (
        <ProposalSkeleton highlightColor={highlightColor}>
          <Skeleton
            borderRadius={10}
            count={count}
            className="flex flex-col w-full h-80 animate-appear rounded-[10px] mt-3"
          />
        </ProposalSkeleton>
      );
  }
};

export default ListProposalsSkeleton;
