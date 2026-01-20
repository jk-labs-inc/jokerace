import { getWagmiConfig } from "@getpara/evm-wallet-connectors";
import { watchConnection } from "@wagmi/core";
import { useCallback, useEffect, useRef, useState } from "react";

export const useAccountChange = () => {
  const [accountChanged, setAccountChanged] = useState(false);
  const previousAccountRef = useRef<string | null>(null);

  useEffect(() => {
    const unwatch = watchConnection(getWagmiConfig(), {
      onChange(account) {
        if (!account.address) {
          previousAccountRef.current = null;
          setAccountChanged(false);
          return;
        }

        if (previousAccountRef.current && previousAccountRef.current !== account.address) {
          setAccountChanged(true);
        } else if (!previousAccountRef.current) {
          setAccountChanged(false);
        }

        previousAccountRef.current = account.address;
      },
    });

    return () => unwatch();
  }, []);

  const resetAccountChanged = useCallback(() => {
    setAccountChanged(false);
  }, []);

  return { accountChanged, resetAccountChanged };
};
