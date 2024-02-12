import CreateTextInput from "@components/_pages/Create/components/TextInput";
import Image from "next/image";
import { FC } from "react";
import CreateDefaultDropdown, { Option } from "../DefaultDropdown";
import CreateNumberInput from "../NumberInput";
import { chainDropdownOptions, votingPowerOptions } from "./config";

interface CreateRequirementsSettingsProps {
  step: "voting" | "submission";
  settingType: string;
  chain: string;
  tokenAddress: string;
  minTokensRequired: number;
  powerType?: string;
  powerValue?: number;
  error?: Record<string, string | undefined>;
  onChainChange?: (chain: string) => void;
  onTokenAddressChange?: (address: string) => void;
  onMinTokensRequiredChange?: (minTokens: number | null) => void;
  onPowerTypeChange?: (votingPowerType: string) => void;
  onPowerValueChange?: (votingPower: number | null) => void;
}

const CreateRequirementsSettings: FC<CreateRequirementsSettingsProps> = ({
  step,
  settingType,
  chain,
  tokenAddress,
  minTokensRequired,
  error,
  powerType,
  powerValue,
  onChainChange,
  onTokenAddressChange,
  onMinTokensRequiredChange,
  onPowerTypeChange,
  onPowerValueChange,
}) => {
  const chainOption = (chain: string): Option => {
    return {
      value: chain,
      label: chainDropdownOptions.find(c => c.value === chain)?.label ?? "",
    };
  };

  const powerTypeOption = (powerType: string): Option => {
    return {
      value: powerType,
      label: powerType,
    };
  };
  return (
    <div className="md:ml-4 md:pl-4 md:border-l border-true-white mt-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-[16px] text-neutral-11 font-bold uppercase">
            chain of {settingType === "erc20" ? "token" : "nft"}
          </p>
          {settingType === "erc20" ? (
            <div className="flex gap-2 items-center">
              <Image src="/ethereum.svg" alt="ethereum" width={20} height={20} />
              <p className="text-[16px] text-neutral-11 font-bold uppercase">ethereum</p>
            </div>
          ) : (
            <CreateDefaultDropdown
              defaultOption={chainOption(chain)}
              options={chainDropdownOptions}
              className="w-full md:w-44 text-[16px] md:text-[24px] cursor-pointer"
              onChange={onChainChange}
            />
          )}
        </div>
        <div className="flex flex-col gap-4">
          {settingType === "erc721" ? (
            <p className="text-[16px] text-neutral-11 font-bold uppercase">
              min <span className="normal-case">NFTs</span> required
            </p>
          ) : (
            <p className="text-[16px] text-neutral-11 font-bold uppercase">min tokens required</p>
          )}

          <CreateNumberInput
            value={minTokensRequired}
            className="w-full md:w-44 text-[16px] md:text-[24px]"
            placeholder={settingType === "erc20" ? "0.01" : "1"}
            onChange={onMinTokensRequiredChange}
            errorMessage={error?.minTokensRequiredError}
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[16px] text-neutral-11 font-bold uppercase">token address</p>
          <CreateTextInput
            className="w-full md:w-[600px] text-[16px] md:text-[24px]"
            value={tokenAddress}
            placeholder="0x495f947276749ce646f68ac8c248420045cb7b5e"
            onChange={onTokenAddressChange}
          />
          {error?.tokenAddressError ? (
            <p className="text-negative-11 text-[14px] font-bold animate-fadeIn">{error.tokenAddressError}</p>
          ) : (
            <p className="text-[16px] text-neutral-14 font-bold">
              when you press “next,” we’ll take a snapshot of all holders to allowlist
            </p>
          )}
        </div>
        {step === "voting" ? (
          <div className="flex flex-col gap-1">
            <p className="text-[16px] text-neutral-11 font-bold uppercase">voting power</p>
            <div className="flex justify-between md:justify-normal md:gap-3">
              <CreateNumberInput
                className="text-[16px] md:text-[24px]"
                value={powerValue ?? 0}
                placeholder="100"
                onChange={onPowerValueChange}
              />
              <p className="text-[16px] md:text-[24px]">votes per</p>
              <CreateDefaultDropdown
                defaultOption={powerTypeOption(powerType ?? "")}
                options={votingPowerOptions}
                className="w-full md:w-44 text-[16px] md:text-[24px] cursor-pointer"
                onChange={onPowerTypeChange}
              />
            </div>
            <p className="text-negative-11 text-[14px] font-bold animate-fadeIn">{error?.powerValueError}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CreateRequirementsSettings;
