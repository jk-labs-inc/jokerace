import { chains } from "@config/wagmi";
import { useRewardsStore } from "@hooks/useRewards/store";
import { fetchBalance, FetchBalanceResult } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CustomError } from "types/error";

export const useTokenBalance = (inputToken: string) => {
  const rewardsStore = useRewardsStore(state => state);
  const { asPath } = useRouter();
  const [queryTokenBalance, setQueryTokenBalance] = useState<FetchBalanceResult>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (inputToken === "") {
      setQueryTokenBalance(undefined);
      setError("");
      return;
    }

    const fetchTokenBalance = async () => {
      if (inputToken?.match(/^0x[a-fA-F0-9]{40}$/)) {
        const chainId = chains.filter(
          chain => chain.name.toLowerCase().replace(" ", "") === asPath.split("/")?.[2],
        )?.[0]?.id;
        try {
          const balance = await fetchBalance({
            chainId,
            addressOrName: rewardsStore?.rewards?.contractAddress,
            token: inputToken,
          });
          setQueryTokenBalance(balance);
          setError("");
        } catch (error) {
          const customError = error as CustomError;
          setError(customError.message);
          setQueryTokenBalance(undefined);
        }
      } else {
        setError("Invalid address!");
        setQueryTokenBalance(undefined);
      }
    };

    fetchTokenBalance();
  }, [inputToken]);

  return { queryTokenBalance, error };
};
