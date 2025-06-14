import { LINK_BRIDGE_DOCS } from "@config/links";
import { FC } from "react";
import OnrampProviders from "./providers";

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
    <div className={`flex flex-col gap-4 md:gap-6 w-full ${className}`}>
      <div className="flex items-start md:items-center justify-between w-full">
        <div className="flex flex-col gap-2">
          <p className="text-[24px] font-bold text-neutral-11">add funds</p>
          <p className="text-neutral-11 text-[16px] font-bold">
            add $5 of tokens <span className="text-neutral-9">(or edit to get more or less)</span>
          </p>
        </div>
      </div>
      <OnrampProviders chain={chain} asset={asset} />
      <div className="flex items-start flex-col gap-4 md:gap-2">
        <button
          className="text-positive-11 hover:text-positive-9 transition-colors duration-300 ease-in-out font-bold text-[16px]"
          onClick={handleFundFromAnotherChain}
        >
          or fund from another chain
        </button>
        {showBackButton && (
          <div className="relative w-full pt-3 md:pt-0">
            <div
              className="absolute left-0 right-0 top-0 border-t border-neutral-2 md:hidden"
              style={{ width: "100vw", left: "50%", transform: "translateX(-50%)" }}
            ></div>
            <button className="flex items-center gap-[5px] cursor-pointer group" onClick={() => onGoBack?.()}>
              <div className="transition-transform duration-200 group-hover:-translate-x-1">
                <img src="/create-flow/back.svg" alt="back" width={15} height={15} className="mt-[1px]" />
              </div>
              <p className="text-[16px]">back</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onramp;
