import OnrampCard from "@components/Onramp/components/Card";
import { useAccount } from "wagmi";
import { FC } from "react";
import { getOnrampBuyUrl } from "./utils";

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
  const { address } = useAccount();

  const handleOnramp = () => {
    if (!address) return;

    const url = getOnrampBuyUrl({
      address,
      chain,
      asset,
    });

    window.open(url, "_blank");
  };
  return <OnrampCard {...COINBASE_PARAMS} onClick={handleOnramp} />;
};

export default OnrampCoinbaseProvider;
