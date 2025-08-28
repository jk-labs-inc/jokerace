import AddFundsCard from "@components/AddFunds/components/Card";
import MotionSpinner from "@components/UI/MotionSpinner";
import { getChainId } from "@helpers/getChainId";
import { FC } from "react";
import AddFundsJumperWidget from "./components/Widget";
import useJumperBridgeChains from "./hooks/useJumperBridgeChains";

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
  const { data: isSupported, isLoading, isError, retry } = useJumperBridgeChains(chainId);

  if (isLoading) {
    return <MotionSpinner className="flex items-start" />;
  }

  if (isError) {
    return (
      <p className="text-negative-11 text-[16px] font-bold">
        ruh roh! we couldn't load providers,{" "}
        <button className="underline cursor-pointer" onClick={() => retry()}>
          try again!
        </button>
      </p>
    );
  }

  if (!isSupported) {
    return <AddFundsCard {...JUMPER_PARAMS} disabled disabledMessage={`not available on ${chain}`} />;
  }

  return (
    <AddFundsCard {...JUMPER_PARAMS}>
      <AddFundsJumperWidget chainId={chainId} asset={asset} />
    </AddFundsCard>
  );
};

export default AddFundsJumperProvider;
