import { FC } from "react";

interface ConfigurationFormButtonSubmitMobileProps {
  isDisabled: boolean;
  onDeploy?: () => void;
}

const ConfigurationFormButtonSubmitMobile: FC<ConfigurationFormButtonSubmitMobileProps> = ({
  isDisabled,
  onDeploy,
}) => {
  return (
    <div className="bg-true-black fixed bottom-[60px] right-0 px-4 z-50 py-4 border-t-2 border-neutral-2 w-full flex justify-end">
      <button
        onClick={onDeploy}
        disabled={isDisabled}
        className="bg-gradient-purple text-[20px] rounded-[40px] font-bold text-true-black w-40 h-8"
      >
        add pool
      </button>
    </div>
  );
};

export default ConfigurationFormButtonSubmitMobile;
