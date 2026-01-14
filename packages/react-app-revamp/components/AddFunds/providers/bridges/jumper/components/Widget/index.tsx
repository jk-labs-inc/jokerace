import { useModal } from "@getpara/react-sdk";
import { LiFiWidget } from "@lifi/widget";
import { FC } from "react";
import { createJumperWidgetConfig } from "./config";

interface AddFundsJumperWidgetProps {
  chainId: number;
  asset: string;
}

const AddFundsJumperWidget: FC<AddFundsJumperWidgetProps> = ({ chainId, asset }) => {
  const { openModal } = useModal();
  const widgetConfig = createJumperWidgetConfig(chainId, asset, () => openModal());

  return (
    <div className="w-full max-w-full overflow-hidden">
      <LiFiWidget integrator="JokeRace" config={widgetConfig} />
    </div>
  );
};

export default AddFundsJumperWidget;
