import { useContestStore } from "@hooks/useContest/store";
import useContestConfigStore from "@hooks/useContestConfig/store";
import usePriceCurveChartData from "@hooks/usePriceCurveChartData";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import usePriceCurvePoints from "@hooks/usePriceCurvePoints";
import usePriceCurveUpdateInterval from "@hooks/usePriceCurveUpdateInterval";
import { useParentSize } from "@visx/responsive";
import { useShallow } from "zustand/shallow";
import PriceCurveChartError from "./components/ChartError";
import PriceCurveChartLoading from "./components/ChartLoading";
import PriceCurveChart from "./index";

const PriceCurveWrapper = () => {
  const { parentRef, width, height } = useParentSize({ debounceTime: 150 });
  const { contestConfig } = useContestConfigStore(useShallow(state => state));
  const { startPrice, startTime, endTime } = useContestStore(
    useShallow(state => ({
      startPrice: state.charge.type.costToVote,
      startTime: state.votesOpen,
      endTime: state.votesClose,
    })),
  );

  const {
    priceCurveMultiple,
    isLoading: isPriceCurveMultipleLoading,
    isError: isPriceCurveMultipleError,
  } = usePriceCurveMultiple({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });

  const {
    priceCurveUpdateInterval,
    isLoading: isPriceCurveUpdateIntervalLoading,
    isError: isPriceCurveUpdateIntervalError,
  } = usePriceCurveUpdateInterval({
    address: contestConfig.address,
    abi: contestConfig.abi,
    chainId: contestConfig.chainId,
  });

  const {
    pricePoints,
    isLoading: isPriceCurvePointsLoading,
    isError: isPriceCurvePointsError,
  } = usePriceCurvePoints({
    startPrice: startPrice,
    multiple: Number(priceCurveMultiple),
    startTime: startTime,
    endTime: endTime,
    updateIntervalSeconds: priceCurveUpdateInterval,
    enabled:
      !isPriceCurveMultipleLoading &&
      !isPriceCurveMultipleError &&
      !!priceCurveMultiple &&
      !!priceCurveUpdateInterval &&
      !isPriceCurveUpdateIntervalLoading &&
      !isPriceCurveUpdateIntervalError,
  });

  const { chartData, currentPrice, currentIndex } = usePriceCurveChartData({
    pricePoints,
  });

  if (isPriceCurveMultipleLoading || isPriceCurveUpdateIntervalLoading || isPriceCurvePointsLoading) {
    return <PriceCurveChartLoading />;
  }

  if (isPriceCurveMultipleError || isPriceCurveUpdateIntervalError || isPriceCurvePointsError) {
    return <PriceCurveChartError />;
  }

  return (
    <div className="animate-fade-in" ref={parentRef}>
      <PriceCurveChart
        data={chartData}
        currentPrice={currentPrice}
        currentIndex={currentIndex}
        width={width}
        height={height === 0 ? 500 : height}
      />
    </div>
  );
};

export default PriceCurveWrapper;
