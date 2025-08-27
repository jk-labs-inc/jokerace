import { FC } from "react";
import AddFundsJumperWidget from "./components/Widget";
import useJumperBridgeChains from "./hooks/useJumperBridgeChains";
import { getChainId } from "@helpers/getChainId";
import AddFundsCard from "@components/AddFunds/components/Card";
import Loading from "app/contest/new/loading";

interface AddFundsJumperProviderProps {
  chain: string;
  asset: string;
}

const JUMPER_PARAMS = {
  name: "jumper exchange",
  description: "0% fees",
  logo: "/add-funds/jumper.png",
  logoBorderColor: "#BFA1EB",
};

const AddFundsJumperProvider: FC<AddFundsJumperProviderProps> = ({ chain, asset }) => {
  const chainId = getChainId(chain);
  const { data: isSupported, isLoading, error, retry } = useJumperBridgeChains(chainId);

  //TODO: add loading state
  if (isLoading) {
    return <Loading />;
  }

  //TODO: add error state
  if (error) {
    return <div>Error</div>;
  }

  if (!isSupported) {
    return <AddFundsCard {...JUMPER_PARAMS} disabled disabledMessage={`not available on ${chain}`} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <AddFundsJumperWidget chainId={chainId} asset={asset} />
    </div>
  );
};

export default AddFundsJumperProvider;
