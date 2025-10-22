import GradientText from "@components/UI/GradientText";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import useContestConfigStore from "@hooks/useContestConfig/store";
import { useShallow } from "zustand/shallow";
import { useVotingRewardsProjection } from "./hooks";
import usePriceCurveType from "@hooks/usePriceCurveType";
import { PriceCurveType } from "@hooks/useDeployContest/types";
import { FC } from "react";
import VotingWidgetRewardsProjectionTooltip from "./components/Tooltip";
import VotingWidgetRewardsProjectionContainer from "./components/Container";
import VotingWidgetRewardProjectionLoader from "./components/Loader";

interface VotingWidgetRewardsProjectionProps {
  inputValue: string;
  submissionsCount: number;
}

const TOOLTIP_ID = "rewards-projection-tooltip";

const VotingWidgetRewardsProjection: FC<VotingWidgetRewardsProjectionProps> = ({ inputValue, submissionsCount }) => {
  const contestConfig = useContestConfigStore(useShallow(state => state.contestConfig));
  const { priceCurveType, isLoading, isError } = usePriceCurveType({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });
  const { winUpToFormatted, shouldShow } = useVotingRewardsProjection({ inputValue, submissionsCount });

  if (isLoading) return <VotingWidgetRewardProjectionLoader />;

  if (!shouldShow || priceCurveType === PriceCurveType.Flat || isError) return null;

  return (
    <VotingWidgetRewardsProjectionContainer>
      <div className="flex items-center gap-2">
        <GradientText textSizeClassName="text-[16px]" isFontSabo={false}>
          win up to
        </GradientText>
        <InformationCircleIcon
          className="text-neutral-14 w-5 h-5"
          data-tooltip-id={TOOLTIP_ID}
          data-tooltip-place="right"
        />
      </div>
      <VotingWidgetRewardsProjectionTooltip tooltipId={TOOLTIP_ID} />
      <div className="ml-auto">
        <GradientText textSizeClassName="text-[24px] font-bold" isFontSabo={false}>
          {winUpToFormatted} {contestConfig.chainNativeCurrencySymbol.toLowerCase()}
        </GradientText>
      </div>
    </VotingWidgetRewardsProjectionContainer>
  );
};

export default VotingWidgetRewardsProjection;
