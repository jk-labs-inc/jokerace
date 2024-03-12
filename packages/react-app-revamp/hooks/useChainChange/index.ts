import { config } from "@config/wagmi";
import { watchAccount } from "@wagmi/core";
import { useEffect, useState } from "react";

export const useChainChange = () => {
  const [chain, setChain] = useState("");

  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange(data) {
        if (!data.chain?.name) return;

        setChain(data.chain?.name);
      },
    });

    return () => unwatch();
  }, []);

  return chain;
};
