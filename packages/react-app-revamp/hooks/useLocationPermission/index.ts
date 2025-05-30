import { useQuery } from "@tanstack/react-query";
import { getUserLocation } from "lib/geoblocking/locationService";
import { FeatureId } from "lib/geoblocking/types";
import { isCountryBlockedForFeature } from "lib/geoblocking/config";

export function useLocationPermission(featureId: FeatureId) {
  const fetchLocationPermission = async (): Promise<boolean> => {
    const userLocation = await getUserLocation();

    const isBlocked = isCountryBlockedForFeature(userLocation.countryCode, featureId);
    return !isBlocked;
  };

  const {
    data: isPermitted,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-location-permission", featureId],
    queryFn: fetchLocationPermission,
  });

  return {
    isPermitted: isPermitted ?? true,
    isLoading,
    isError,
    error,
    retry: refetch,
  };
}

export function useProposalVotingPermission() {
  return useLocationPermission("proposals_voting");
}

export function useIsLocationPermitted(featureId: FeatureId): boolean {
  const { isPermitted } = useLocationPermission(featureId);
  return isPermitted;
}
