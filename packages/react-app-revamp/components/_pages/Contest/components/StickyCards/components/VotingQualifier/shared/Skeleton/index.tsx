import { FC } from "react";
import Skeleton from "react-loading-skeleton";

const VotingQualifierSkeleton: FC = () => {
  return <Skeleton width={100} height={24} baseColor="#6A6A6A" highlightColor="#BB65FF" />;
};

export default VotingQualifierSkeleton;