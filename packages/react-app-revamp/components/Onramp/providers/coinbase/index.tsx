import OnrampCard from "@components/Onramp/components/Card";
import { toastError } from "@components/UI/Toast";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { useAccount } from "wagmi";
import { getOnrampBuyUrl, isChainSupported } from "./utils";

interface OnrampCoinbaseProviderProps {
  chain: string;
  asset: string;
}

const COINBASE_PARAMS = {
  name: "Coinbase",
  description: "2.5% fees",
  logo: "/onramp/coinbase.svg",
  logoBorderColor: "#0052FF",
};

const OnrampCoinbaseProvider: FC<OnrampCoinbaseProviderProps> = ({ chain, asset }) => {
  const isEntryPage = usePathname().includes("submission");
  const { address } = useAccount();
  // TODO: remove this once we have a new logic for coinbase (session token etc.)
  const isSupported = false;

  const handleOnramp = () => {
    if (!address) return;

    const url = getOnrampBuyUrl({
      address,
      chain,
      asset,
    });

    if (!url) {
      toastError({
        message: "Unable to get onramp url",
      });
      return;
    }

    window.open(url, "_blank");
  };

  return (
    <OnrampCard
      {...COINBASE_PARAMS}
      onClick={handleOnramp}
      descriptionClassName={isEntryPage ? "text-[14px]" : ""}
      disabled={!isSupported}
      disabledMessage={!isSupported ? `not available at the moment` : ""}
    />
  );
};

export default OnrampCoinbaseProvider;
