import { useEffect, useState } from "react";
import { ConnectorData, useAccount } from "wagmi";

export const useAccountChange = () => {
  const { connector: activeConnector } = useAccount();
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const handleConnectorUpdate = ({ account: updatedAccount }: ConnectorData) => {
      if (updatedAccount) {
        setAccount(updatedAccount);
      }
    };

    if (activeConnector) {
      activeConnector.on("change", handleConnectorUpdate);
    }

    return () => {
      activeConnector?.off("change", handleConnectorUpdate);
    };
  }, [activeConnector]);

  return account;
};
