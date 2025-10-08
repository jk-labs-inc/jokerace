import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { FC, memo } from "react";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
}

const LoadMoreButton: FC<LoadMoreButtonProps> = ({ onLoadMore }) => {
  return (
    <div className="flex gap-2 items-center py-4 cursor-pointer" onClick={onLoadMore}>
      <p className="text-[16px] text-positive-11 font-bold uppercase">load more</p>
      <button className="transition-transform duration-500 ease-in-out transform rotate-180">
        <ChevronUpIcon height={20} className="text-positive-11" />
      </button>
    </div>
  );
};

export default memo(LoadMoreButton);
