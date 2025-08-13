import OnrampCard from "@components/Onramp/components/Card";
import { usePathname } from "next/navigation";
import { FC } from "react";

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

  return (
    <OnrampCard
      {...COINBASE_PARAMS}
      descriptionClassName={isEntryPage ? "text-[14px]" : ""}
      disabled={true}
      disabledMessage={`not available at the moment`}
    />
  );
};

export default OnrampCoinbaseProvider;
