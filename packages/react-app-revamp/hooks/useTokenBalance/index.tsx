import { chains, config } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useRewardsStore } from "@hooks/useRewards/store";
import { getBalance, type GetBalanceReturnType } from "@wagmi/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { handleError } from "utils/error";

export const useTokenBalance = (inputToken: string) => {
  const rewardsStore = useRewardsStore(state => state);
  const { asPath } = useRouter();
  const { chainName } = extractPathSegments(asPath);
  const [queryTokenBalance, setQueryTokenBalance] = useState<GetBalanceReturnType>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (inputToken === "") {
      setQueryTokenBalance(undefined);
      setError("");
      return;
    }

    const fetchTokenBalance = async () => {
      if (inputToken?.match(/^0x[a-fA-F0-9]{40}$/)) {
        const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
        try {
          const balance = await getBalance(config, {
            chainId,
            address: rewardsStore?.rewards?.contractAddress as `0x${string}`,
            token: inputToken as `0x${string}`,
          });
          setQueryTokenBalance(balance);
          setError("");
        } catch (e) {
          const { message: errorMessage } = handleError(e);
          setError(errorMessage);
          setQueryTokenBalance(undefined);
        }
      } else {
        setError("Invalid address!");
        setQueryTokenBalance(undefined);
      }
    };

    fetchTokenBalance();
  }, [chainName, inputToken, rewardsStore?.rewards?.contractAddress]);

  return { queryTokenBalance, error };
};
