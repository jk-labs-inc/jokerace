import { config } from "@config/wagmi";
import { watchAccount } from "@wagmi/core";
import { useEffect, useState } from "react";

export const useAccountChange = () => {
  const [account, setAccount] = useState("");

  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange(data) {
        if (!data.address) return;

        setAccount(data.address);
      },
    });

    return () => unwatch();
  }, []);

  return account;
};
