import { useQuery } from "@tanstack/react-query";
import { getTokenAddresses } from "lib/rewards";

export function useRewardTokens(rewardsModuleAddress: string, chainName: string) {
  return useQuery({
    queryKey: ["rewardTokens", rewardsModuleAddress, chainName],
    queryFn: async () => {
      if (!chainName) throw new Error("Network not connected");
      return getTokenAddresses(rewardsModuleAddress, chainName);
    },
    enabled: !!rewardsModuleAddress && !!chainName,
  });
}

export default useRewardTokens;
