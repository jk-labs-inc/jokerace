// hooks/useUserBalance.js

import { fetchUserBalance } from "lib/fetchUserBalance";
import { useState, useEffect } from "react";

export const useUserBalance = (address: string, chainId: number, token?: string) => {
  const [qualified, setQualified] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const fetchedBalance = await fetchUserBalance(address, chainId, token);
        setQualified(fetchedBalance.value.gt(0));
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [address, chainId, token]);

  return { qualified, loading };
};
