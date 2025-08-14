import { useContestStore } from "@hooks/useContest/store";
import usePriceCurveMultiple from "@hooks/usePriceCurveMultiple";
import usePriceCurveChartData from "@hooks/usePriceCurveChartData";
import { generatePricePoints } from "lib/priceCurve";
import React, { useMemo } from "react";
import { useShallow } from "zustand/shallow";
import PriceCurveChart from "./index";
import { PriceCurveWrapperProps } from "./types";

const PriceCurveWrapper: React.FC<PriceCurveWrapperProps> = ({
  contestAddress,
  chainId,
  startDate,
  endDate,
  currentPriceETH,
}) => {
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

  // Generate all price points
  const allPricePoints = useMemo(() => {
    return generatePricePoints({
      startPrice: startPrice,
      multiple: Number(priceCurveMultiple),
      startTime: startTime,
      endTime: endTime,
      updateIntervalSeconds: 60,
    });
  }, [startPrice, priceCurveMultiple, startTime, endTime]);

  // Get sliding window chart data
  const { chartData, currentPrice } = usePriceCurveChartData({
    pricePoints: allPricePoints,
    currentTime: new Date(),
    prevCount: 1,
    nextCount: 4,
  });

  return (
    <div className="w-full">
      <PriceCurveChart data={chartData} currentPrice={currentPrice} />
    </div>
  );
};

export default PriceCurveWrapper;
