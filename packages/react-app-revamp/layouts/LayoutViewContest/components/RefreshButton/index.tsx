import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { FC } from "react";

const RefreshButton: FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      className="standalone-pwa w-8 h-8 items-center rounded-[10px] border border-neutral-11 cursor-pointer"
      onClick={handleRefresh}
      role="button"
      tabIndex={0}
      aria-label="Refresh page"
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleRefresh();
        }
      }}
    >
      <ArrowPathIcon className="w-4 h-4 m-auto" />
    </div>
  );
};

export default RefreshButton;
