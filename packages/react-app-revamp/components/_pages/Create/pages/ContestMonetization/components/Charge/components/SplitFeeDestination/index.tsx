import { Radio, RadioGroup } from "@headlessui/react";
import shortenEthereumAddress from "@helpers/shortenEthereumAddress";
import { SplitFeeDestination, SplitFeeDestinationType } from "@hooks/useDeployContest/types";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface ContestParamsSplitFeeDestinationProps {
  splitFeeDestination: SplitFeeDestination;
  splitFeeDestinationError: string;
  onSplitFeeDestinationTypeChange?: (value: SplitFeeDestinationType) => void;
  onSplitFeeDestinationAddressChange?: (value: string) => void;
  includeRewardsInfo?: boolean;
  includeRewardsPool?: boolean;
  rewardsModuleAddress?: string;
}

const PLACEHOLDER_ADDRESS = "0x7B15427393A98A041D00b50254A0C7a6fDC79F4E";

const ContestParamsSplitFeeDestination: FC<ContestParamsSplitFeeDestinationProps> = ({
  splitFeeDestination,
  splitFeeDestinationError,
  onSplitFeeDestinationTypeChange,
  onSplitFeeDestinationAddressChange,
  includeRewardsInfo,
  includeRewardsPool,
  rewardsModuleAddress,
}) => {
  const [selected, setSelected] = useState<SplitFeeDestinationType>(splitFeeDestination.type);
  const [address, setAddress] = useState(splitFeeDestination.address);
  const [isRewardsModuleAddress, setIsRewardsModuleAddress] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const percentageTitle = isMobile
    ? "who should we split earnings with?"
    : "we split all earnings 50/50. who should receive these?";

  useEffect(() => {
    setSelected(splitFeeDestination.type);
    setAddress(splitFeeDestination.address);

    if (splitFeeDestination.address === rewardsModuleAddress) {
      setIsRewardsModuleAddress(true);
    } else {
      setIsRewardsModuleAddress(false);
    }
  }, [splitFeeDestination, rewardsModuleAddress]);

  const handleSplitFeeDestinationTypeChange = (value: SplitFeeDestinationType) => {
    setSelected(value);
    onSplitFeeDestinationTypeChange?.(value);
  };

  const handleSplitFeeDestinationAddressChange = (value: string) => {
    if (value === rewardsModuleAddress) {
      setIsRewardsModuleAddress(true);
    } else {
      setIsRewardsModuleAddress(false);
    }
    setAddress(value);
    onSplitFeeDestinationAddressChange?.(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <p className="text-[20px] md:text-[20px] text-neutral-11 font-bold">{percentageTitle}</p>
        <RadioGroup value={selected} onChange={handleSplitFeeDestinationTypeChange}>
          <div className="flex flex-col gap-2">
            <Radio value={SplitFeeDestinationType.CreatorWallet}>
              {({ checked }) => (
                <div className="flex gap-4 items-start cursor-pointer">
                  <div
                    className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                      checked ? "bg-secondary-11  border-0" : ""
                    }`}
                  ></div>
                  <div className="flex flex-col gap-4">
                    <p className="text-[20px] text-neutral-9">my wallet (recommended)</p>
                  </div>
                </div>
              )}
            </Radio>
            <Radio value={SplitFeeDestinationType.AnotherWallet}>
              {({ checked }) => (
                <div className="flex gap-4 items-start cursor-pointer">
                  <div
                    className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                      checked ? "bg-secondary-11 border-0" : ""
                    } `}
                  ></div>
                  <div className="flex flex-col gap-2">
                    <p className={`text-[20px] text-neutral-9`}>another wallet</p>
                    {checked ? (
                      <>
                        <input
                          type="text"
                          autoFocus
                          value={address}
                          onChange={e => handleSplitFeeDestinationAddressChange(e.target.value)}
                          placeholder={
                            isMobile ? shortenEthereumAddress(PLACEHOLDER_ADDRESS, "long") : PLACEHOLDER_ADDRESS
                          }
                          className="w-full md:w-[536px] h-10 bg-true-black border border-secondary-11 rounded-[10px] text-[20px] text-neutral-11 placeholder-neutral-10 placeholder:font-bold p-4 focus:outline-none"
                        />
                        {isRewardsModuleAddress && (
                          <p className="text-[16px] font-bold text-secondary-11">
                            looks like this is the rewards pool! we’ll send all your earnings to the rewards.
                          </p>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
              )}
            </Radio>
            <Radio value={SplitFeeDestinationType.NoSplit}>
              {({ checked }) => (
                <div className="flex gap-4 items-start cursor-pointer">
                  <div
                    className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                      checked ? "bg-secondary-11  border-0" : ""
                    }`}
                  ></div>
                  <div className="flex flex-col gap-4">
                    <p className="text-[20px] text-neutral-9">i prefer to take 0% of earnings</p>
                  </div>
                </div>
              )}
            </Radio>
            {includeRewardsPool ? (
              <Radio value={SplitFeeDestinationType.RewardsPool}>
                {({ checked }) => (
                  <div className="flex gap-4 items-start cursor-pointer">
                    <div
                      className={`flex items-center mt-1 justify-center w-6 h-6 border border-neutral-9 rounded-[10px] transition-colors ${
                        checked ? "bg-secondary-11  border-0" : ""
                      }`}
                    ></div>
                    <div className="flex flex-col gap-4">
                      <p className="text-[20px] text-neutral-9">
                        the rewards pool <span className="text-secondary-11">(new)</span>
                      </p>
                    </div>
                  </div>
                )}
              </Radio>
            ) : null}
          </div>
        </RadioGroup>
      </div>
      {includeRewardsInfo ? (
        <p className="text-[16px] text-neutral-11">
          {isMobile ? (
            "create a rewards pool after creating this contest to set your earnings to go to rewards."
          ) : (
            <>
              want your earnings to go towards rewards? finish creating this contest, then create a <br />
              rewards pool, and then you’ll have the option.
            </>
          )}
        </p>
      ) : null}
    </div>
  );
};

export default ContestParamsSplitFeeDestination;
