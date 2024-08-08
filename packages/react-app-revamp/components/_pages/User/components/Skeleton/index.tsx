import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const UserListSkeleton = () => {
  return (
    <div className="container mx-auto mt-3">
      <div className="px-4 py-3 text-[20px] font-bold">
        <Skeleton width={100} />
      </div>
      {[...Array(5)].map((_, index) => (
        <SkeletonTheme baseColor="#706f78" highlightColor="#FFE25B" duration={1} key={index}>
          <div
            className="flex items-center gap-6 border-t border-neutral-9 py-4 p-3 
               hover:bg-neutral-3 transition-colors duration-500 ease-in-out cursor-pointer text-[16px]"
          >
            <Skeleton circle width={32} height={32} />
            <Skeleton width={300} height={16} />
          </div>
        </SkeletonTheme>
      ))}
    </div>
  );
};

export default UserListSkeleton;
