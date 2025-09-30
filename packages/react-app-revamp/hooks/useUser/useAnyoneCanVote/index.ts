import { PriceCurveType } from "@hooks/useDeployContest/types";
import { useEffect, useRef, useState } from "react";
import { Abi } from "viem";
import { fetchExponentialCurveData, getPriceCurveType } from "./contract";
import { cleanupExponentialUpdates as cleanupUpdates, setupExponentialUpdates } from "./exponential";
import { calculateUserVoteQualification as calculateQualification } from "./qualification";
import { ExponentialCurveData, UserVoteQualificationSetter } from "./types";

export const useAnyoneCanVote = (userAddress: `0x${string}` | undefined, address: string, chainId: number) => {
  const [exponentialCurveData, setExponentialCurveData] = useState<ExponentialCurveData>({
    updateInterval: 0,
    contestDeadline: 0,
    voteStart: 0,
    isLoaded: false,
  });

  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentPriceCurveTypeRef = useRef<PriceCurveType | null>(null);

  useEffect(() => {
    return () => {
      cleanupExponentialUpdates();
    };
  }, []);

  /**
   * Clean up periodic update intervals
   */
  const cleanupExponentialUpdates = () => {
    cleanupUpdates(updateIntervalRef);
  };

  /**
   * Main function to check if current user qualifies for anyone-can-vote contests
   * @param abi - Contract ABI
   * @param setUserVoteQualification - Function to set user vote qualification state
   */
  const checkAnyoneCanVoteUserQualification = async (
    abi: Abi,
    setUserVoteQualification: UserVoteQualificationSetter,
  ) => {
    if (!userAddress) return;

    try {
      const priceCurveType = await getPriceCurveType(address, abi, chainId);
      currentPriceCurveTypeRef.current = priceCurveType;

      // Handle exponential price curves with periodic updates
      if (priceCurveType === PriceCurveType.Exponential) {
        // Fetch curve data if not already loaded
        if (!exponentialCurveData.isLoaded) {
          const curveData = await fetchExponentialCurveData(address, abi, chainId);
          setExponentialCurveData(curveData);

          // Set up smart updates that handle both pre-voting and voting states
          if (curveData.isLoaded) {
            setupExponentialUpdates(
              address,
              userAddress,
              chainId,
              abi,
              curveData,
              setUserVoteQualification,
              updateIntervalRef,
            );
          }
        } else {
          // Data already loaded, set up smart updates
          setupExponentialUpdates(
            address,
            userAddress,
            chainId,
            abi,
            exponentialCurveData,
            setUserVoteQualification,
            updateIntervalRef,
          );
        }
      } else {
        // Flat curve - clean up any existing updates
        cleanupExponentialUpdates();
      }

      // Perform initial calculation for price curve versions
      const voteCostFunctionName = priceCurveType === PriceCurveType.Exponential ? "currentPricePerVote" : "costToVote";
      await calculateQualification(address, userAddress, chainId, abi, voteCostFunctionName, setUserVoteQualification);
    } catch (error) {
      console.error("error in checkAnyoneCanVoteUserQualification:", error);
      setUserVoteQualification(0, 0, false, false, true);
    }
  };

  return {
    checkAnyoneCanVoteUserQualification,
  };
};
