import { FC, ReactNode } from "react";

interface RewardsSplitLayoutProps {
  playerView: ReactNode;
  creatorView: ReactNode;
  showBothViews?: boolean;
}

const RewardsSplitLayout: FC<RewardsSplitLayoutProps> = ({ playerView, creatorView, showBothViews = true }) => {
  return (
    <div className="flex flex-col md:flex-row w-full gap-8">
      <div className="w-full md:w-1/2 md:border-r md:border-neutral-10 md:pr-4">{playerView}</div>

      {showBothViews && <div className="w-full md:w-1/2 md:pl-4">{creatorView}</div>}
    </div>
  );
};

export default RewardsSplitLayout;
