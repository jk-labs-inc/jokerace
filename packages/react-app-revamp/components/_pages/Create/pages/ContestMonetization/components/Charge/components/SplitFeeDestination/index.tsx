import { RadioGroup } from "@headlessui/react";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { SplitFeeDestination, SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface ContestParamsSplitFeeDestinationProps {
  splitFeeDestination: SplitFeeDestination;
  splitFeeDestinationError: string;
  onSplitFeeDestinationTypeChange?: (value: SplitFeeDestinationType) => void;
  onSplitFeeDestinationAddressChange?: (value: string) => void;
}

const PLACEHOLDER_ADDRESS = "0x7B15427393A98A041D00b50254A0C7a6fDC79F4E";

const ContestParamsSplitFeeDestination: FC<ContestParamsSplitFeeDestinationProps> = ({
  splitFeeDestination,
  splitFeeDestinationError,
  onSplitFeeDestinationTypeChange,
  onSplitFeeDestinationAddressChange,
}) => {
  const [selected, setSelected] = useState<SplitFeeDestinationType>(splitFeeDestination.type);
  const [address, setAddress] = useState(splitFeeDestination.address);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const percentageTitle = isMobile
    ? "who should we split earnings with?"
    : "we split all earnings 50/50. who should receive these?";

  const handleSplitFeeDestinationTypeChange = (value: SplitFeeDestinationType) => {
    setSelected(value);
    onSplitFeeDestinationTypeChange?.(value);
  };

  const handleSplitFeeDestinationAddressChange = (value: string) => {
    setAddress(value);
    onSplitFeeDestinationAddressChange?.(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] md:text-[20px] text-neutral-11 font-bold">{percentageTitle}</p>
      <RadioGroup value={selected} onChange={handleSplitFeeDestinationTypeChange}>
        <div className="flex flex-col gap-2">
          <RadioGroup.Option value={SplitFeeDestinationType.CreatorWallet}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-primary-10  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className="text-[20px] text-neutral-9">my wallet (recommended)</p>
                </div>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value={SplitFeeDestinationType.AnotherWallet}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-primary-10 border-0" : ""
                  } `}
                ></div>
                <div className="flex flex-col gap-2">
                  <p className={`text-[20px] text-neutral-9`}>another wallet</p>
                  {checked ? (
                    <input
                      type="text"
                      value={address}
                      onChange={e => handleSplitFeeDestinationAddressChange(e.target.value)}
                      placeholder={isMobile ? shortenEthereumAddress(PLACEHOLDER_ADDRESS, "long") : PLACEHOLDER_ADDRESS}
                      className="w-full md:w-[536px] h-10 bg-neutral-14 rounded-[10px] text-[20px] text-true-black placeholder-neutral-10 placeholder:font-bold p-4 focus:outline-none"
                    />
                  ) : null}
                </div>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value={SplitFeeDestinationType.NoSplit}>
            {({ checked }) => (
              <div className="flex gap-4 items-start cursor-pointer">
                <div
                  className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                    checked ? "bg-primary-10  border-0" : ""
                  }`}
                ></div>
                <div className="flex flex-col gap-4">
                  <p className="text-[20px] text-neutral-9">i prefer to take 0% of charges</p>
                </div>
              </div>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ContestParamsSplitFeeDestination;
