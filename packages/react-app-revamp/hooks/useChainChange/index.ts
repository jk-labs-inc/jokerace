import { getWagmiConfig } from "@getpara/evm-wallet-connectors";
import { watchConnection } from "@wagmi/core";
import { useEffect, useState } from "react";

export const useChainChange = () => {
  const [chain, setChain] = useState("");

  useEffect(() => {
    const unwatch = watchConnection(getWagmiConfig(), {
      onChange(connection) {
        if (!connection.chain?.name) return;

        setChain(connection.chain?.name);
      },
    });

    return () => unwatch();
  }, []);

  return chain;
};
