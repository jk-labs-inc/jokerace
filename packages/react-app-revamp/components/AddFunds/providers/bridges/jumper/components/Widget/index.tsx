import { LiFiWidget } from "@lifi/widget";
import { FC } from "react";
import { createJumperWidgetConfig } from "./config";

interface AddFundsJumperWidgetProps {
  chainId: number;
  asset: string;
}

const AddFundsJumperWidget: FC<AddFundsJumperWidgetProps> = ({ chainId, asset }) => {
  const widgetConfig = createJumperWidgetConfig(chainId, asset);

  return <LiFiWidget integrator="JokeRace" config={widgetConfig} />;
};

export default AddFundsJumperWidget;
