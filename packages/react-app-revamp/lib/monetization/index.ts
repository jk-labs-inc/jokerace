type ChargeDetails = {
  minCostToPropose: number;
  minCostToVote: number;
  isError: boolean;
};

const defaultChargeDetails: ChargeDetails = {
  minCostToPropose: 0,
  minCostToVote: 0,
  isError: false,
};

export const fetchChargeDetails = async (chainName: string): Promise<ChargeDetails> => {
  if (!chainName) {
    return { ...defaultChargeDetails, isError: true };
  }

  try {
    const response = await fetch(`/api/monetization/charge-details?chainName=${encodeURIComponent(chainName)}`);

    if (!response.ok) {
      throw new Error("failed to fetch charge details");
    }

    const chargeDetails: ChargeDetails = await response.json();
    return chargeDetails;
  } catch (error) {
    console.error("error fetching charge details:", error);
    return { ...defaultChargeDetails, isError: true };
  }
};
