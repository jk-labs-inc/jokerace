import { config } from "@config/wagmi";
import { watchAccount } from "@wagmi/core";
import { useEffect, useState } from "react";

export const useAccountChange = () => {
  const [account, setAccount] = useState("");

  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange(account) {
        if (!account.address) return;

        setAccount(account.address);
      },
    });

    return () => unwatch();
  }, []);

  return account;
};
