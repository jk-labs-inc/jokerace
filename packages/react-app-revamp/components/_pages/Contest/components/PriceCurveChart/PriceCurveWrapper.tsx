import { useContestStore } from "@hooks/useContest/store";
import usePriceCurveChartData from "@hooks/usePriceCurveChartData";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import { useParentSize } from "@visx/responsive";
import { generatePricePoints } from "lib/priceCurve";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import PriceCurveChart from "./index";

const PriceCurveWrapper = () => {
  const { parentRef, width, height } = useParentSize({ debounceTime: 150 });
  const { contestInfo, abi, startPrice, startTime, endTime } = useContestStore(
    useShallow(state => ({
      contestInfo: state.contestInfoData,
      abi: state.contestAbi,
      startPrice: state.charge.type.costToVote,
      startTime: state.votesOpen,
      endTime: state.votesClose,
    })),
  );

  const { priceCurveMultiple } = usePriceCurveMultiple({
    address: contestInfo.contestAddress,
    abi: abi,
    chainId: contestInfo.contestChainId,
  });

  const allPricePoints = useMemo(() => {
    return generatePricePoints({
      startPrice: startPrice,
      multiple: Number(priceCurveMultiple),
      startTime: startTime,
      endTime: endTime,
      updateIntervalSeconds: 60,
    });
  }, [startPrice, priceCurveMultiple, startTime, endTime]);

  const { chartData, currentPrice } = usePriceCurveChartData({
    pricePoints: allPricePoints,
    currentTime: new Date(),
  });

  return (
    <div className="w-full h-full" ref={parentRef}>
      <PriceCurveChart
        data={chartData}
        currentPrice={currentPrice}
        width={width}
        height={height === 0 ? 500 : height}
      />
    </div>
  );
};

export default PriceCurveWrapper;
