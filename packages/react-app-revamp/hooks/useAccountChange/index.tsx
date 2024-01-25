import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const useAccountChange = () => {
  const { connector: activeConnector } = useAccount();
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    //TODO: check type for updatedAccount and activeConnector
    const handleConnectorUpdate = ({ account: updatedAccount }: any) => {
      if (updatedAccount) {
        setAccount(updatedAccount.address);
      }
    };

    if (activeConnector) {
      activeConnector.emitter.on("change", handleConnectorUpdate);
    }

    return () => {
      activeConnector?.emitter.off("change", handleConnectorUpdate);
    };
  }, [activeConnector]);

  return account;
};
