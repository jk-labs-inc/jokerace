import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import { FC } from "react";

const RewardsLoader: FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <SkeletonTheme baseColor="#000000" highlightColor="#212121" duration={1}>
      <Skeleton borderRadius={10} className="h-8 shrink-0 p-2 border border-neutral-11" width={isMobile ? 100 : 200} />
    </SkeletonTheme>
  );
};

export default RewardsLoader;
