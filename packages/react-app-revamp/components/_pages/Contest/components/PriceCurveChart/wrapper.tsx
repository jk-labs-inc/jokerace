import { useContestStore } from "@hooks/useContest/store";
import usePriceCurveChartData from "@hooks/usePriceCurveChartData";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import usePriceCurvePoints from "@hooks/usePriceCurvePoints";
import { useParentSize } from "@visx/responsive";
import { useShallow } from "zustand/shallow";
import PriceCurveChart from "./index";
import usePriceCurveUpdateInterval from "@hooks/usePriceCurveUpdateInterval";

//TODO: refactor this so all data is called in a better way
const PriceCurveWrapper = () => {
  const { parentRef, width, height } = useParentSize({ debounceTime: 150 });
  const { contestInfo, abi, startPrice, startTime, endTime, version } = useContestStore(
    useShallow(state => ({
      contestInfo: state.contestInfoData,
      abi: state.contestAbi,
      startPrice: state.charge.type.costToVote,
      startTime: state.votesOpen,
      endTime: state.votesClose,
      version: state.version,
    })),
  );

  const {
    priceCurveMultiple,
    isLoading: isPriceCurveMultipleLoading,
    isError: isPriceCurveMultipleError,
  } = usePriceCurveMultiple({
    address: contestInfo.contestAddress,
    abi: abi,
    chainId: contestInfo.contestChainId,
  });
  const {
    priceCurveUpdateInterval,
    isLoading: isPriceCurveUpdateIntervalLoading,
    isError: isPriceCurveUpdateIntervalError,
  } = usePriceCurveUpdateInterval({
    address: contestInfo.contestAddress,
    abi: abi,
    chainId: contestInfo.contestChainId,
    version: version,
  });

  const { pricePoints } = usePriceCurvePoints({
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

  return (
    <div className="w-full h-full animate-appear" ref={parentRef}>
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
