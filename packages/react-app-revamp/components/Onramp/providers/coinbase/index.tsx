import OnrampCard from "@components/Onramp/components/Card";
import { useAccount } from "wagmi";
import { FC } from "react";
import { getOnrampBuyUrl, isChainSupported } from "./utils";
import { usePathname } from "next/navigation";
import { toastError } from "@components/UI/Toast";

interface OnrampCoinbaseProviderProps {
  chain: string;
  asset: string;
}

const COINBASE_PARAMS = {
  name: "Coinbase",
  description: "1.59% fees | NY citizens excluded",
  logo: "/onramp/coinbase.svg",
  logoBorderColor: "#0052FF",
};

const OnrampCoinbaseProvider: FC<OnrampCoinbaseProviderProps> = ({ chain, asset }) => {
  const isEntryPage = usePathname().includes("submission");
  const { address } = useAccount();
  const isSupported = isChainSupported(chain);

  const handleOnramp = () => {
    if (!address) return;

    const url = getOnrampBuyUrl({
      address,
      chain,
      asset,
    });

    if (!url) {
      toastError("Unable to get onramp url");
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
      disabledMessage={!isSupported ? `NOT SUPPORTED ON ${chain}` : ""}
    />
  );
};

export default OnrampCoinbaseProvider;
