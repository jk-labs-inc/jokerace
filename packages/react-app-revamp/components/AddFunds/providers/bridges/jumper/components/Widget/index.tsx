import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import { FC } from "react";

interface AddFundsJumperWidgetProps {
  integrator?: string;
  border?: string;
  borderRadius?: string;
  className?: string;
}

const AddFundsJumperWidget: FC<AddFundsJumperWidgetProps> = ({
  integrator = "JokeRace",
  border = "1px solid rgb(234, 234, 234)",
  borderRadius = "16px",
  className = "",
}) => {
  const widgetConfig: WidgetConfig = {
    integrator,
    theme: {
      container: {
        border,
        borderRadius,
      },
    },
  };

  return (
    <div className={className}>
      <LiFiWidget integrator={integrator} config={widgetConfig} />
    </div>
  );
};

export default AddFundsJumperWidget;
