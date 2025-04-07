import OnrampProviders from "./providers";
import { FC } from "react";
import { LINK_BRIDGE_DOCS } from "@config/links";

interface OnrampProps {
  chain: string;
  asset: string;
  showBackButton?: boolean;
  className?: string;
  onGoBack?: () => void;
}

const Onramp: FC<OnrampProps> = ({ chain, asset, onGoBack, showBackButton = true, className }) => {
  const handleFundFromAnotherChain = () => {
    window.open(LINK_BRIDGE_DOCS, "_blank");
  };

  return (
    <div className={`flex flex-col gap-4 md:gap-8 w-full ${className}`}>
      <div className="flex items-start md:items-center justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="text-[24px] font-bold text-neutral-11">add funds</p>
          <button
            className="block md:hidden text-positive-11 font-bold text-[16px]"
            onClick={handleFundFromAnotherChain}
          >
            or fund from another chain
          </button>
        </div>

        {showBackButton && (
          <button
            className="text-neutral-11 font-bold text-[16px] cursor-pointer"
            onClick={() => onGoBack?.()}
            aria-label="Go back"
            tabIndex={0}
          >
            ← go back
          </button>
        )}
      </div>
      <div className="flex flex-col gap-6 items-start">
        <OnrampProviders chain={chain} asset={asset} />
        <button className="hidden md:block text-positive-11 font-bold text-[16px]" onClick={handleFundFromAnotherChain}>
          or fund from another chain
        </button>
      </div>
    </div>
  );
};

export default Onramp;
