import { FC, ReactNode } from "react";

interface RewardsSplitLayoutProps {
  playerView: ReactNode;
  creatorView: ReactNode;
  showBothViews?: boolean;
}

const RewardsSplitLayout: FC<RewardsSplitLayoutProps> = ({ playerView, creatorView, showBothViews = true }) => {
  return (
    <div className="flex flex-col md:flex-row w-full gap-6 md:gap-0">
      <div className="w-full md:w-1/2 md:border-r md:border-neutral-10 md:pr-20">{playerView}</div>

      {showBothViews && (
        <>
          <div className="w-full h-px bg-neutral-6 md:hidden" />
          <div className="w-full md:w-1/2 md:pl-20">{creatorView}</div>
        </>
      )}
    </div>
  );
};

export default RewardsSplitLayout;
