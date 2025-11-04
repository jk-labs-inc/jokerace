import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import { FC } from "react";

interface ConfigurationFormButtonSubmitDesktopProps {
  isDisabled: boolean;
  onDeploy?: () => void;
}

const ConfigurationFormButtonSubmitDesktop: FC<ConfigurationFormButtonSubmitDesktopProps> = ({
  onDeploy,
  isDisabled,
}) => {
  return (
    <ButtonV3
      size={ButtonSize.EXTRA_LARGE_LONG}
      onClick={onDeploy}
      isDisabled={isDisabled}
      colorClass="bg-gradient-purple text-[24px] rounded-[16px] font-bold text-true-black hover:scale-105 transition-transform duration-200 ease-in-out"
    >
      add rewards pool
    </ButtonV3>
  );
};

export default ConfigurationFormButtonSubmitDesktop;
