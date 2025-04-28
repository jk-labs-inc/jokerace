import { FC } from "react";
import OnrampCoinbaseProvider from "./coinbase";

interface OnrampProvidersProps {
  chain: string;
  asset: string;
}

const OnrampProviders: FC<OnrampProvidersProps> = ({ chain, asset }) => {
  const providers = [<OnrampCoinbaseProvider key="coinbase" chain={chain} asset={asset} />];

  return <div className="flex flex-col gap-4 w-full">{providers}</div>;
};

export default OnrampProviders;
