import { config } from "@config/wagmi";
import { watchAccount } from "@wagmi/core";
import { useEffect, useState, useRef, useCallback } from "react";

export const useAccountChange = () => {
  const [accountChanged, setAccountChanged] = useState(false);
  const previousAccountRef = useRef<string | null>(null);

  useEffect(() => {
    const unwatch = watchAccount(config, {
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
