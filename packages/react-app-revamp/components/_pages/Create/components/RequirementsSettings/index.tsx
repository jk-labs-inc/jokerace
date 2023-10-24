import CreateDropdown from "@components/_pages/Create/components/Dropdown";
import CreateTextInput from "@components/_pages/Create/components/TextInput";
import { FC } from "react";
import { chainDropdownOptions, votingPowerOptions } from "./config";
import { MAX_VOTES } from "@helpers/csvConstants";

interface CreateVotingRequirementsSettingsProps {
  step: "voting" | "submission";
  settingType: "erc721" | "erc20";
  chain: string;
  tokenAddress: string;
  minTokensRequired: string;
  powerType?: string;
  powerValue?: string;
  error?: Record<string, string | undefined>;
  onChainChange?: (chain: string) => void;
  onTokenAddressChange?: (address: string) => void;
  onMinTokensRequiredChange?: (minTokens: string) => void;
  onPowerTypeChange?: (votingPowerType: string) => void;
  onPowerValueChange?: (votingPower: string) => void;
}

const CreateVotingRequirementsSettings: FC<CreateVotingRequirementsSettingsProps> = ({
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
  return (
    <div className="md:ml-4 md:pl-4 md:border-l border-true-white mt-4">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-[16px] text-primary-10 font-bold uppercase">chain</p>
          <CreateDropdown
            value={chain}
            options={chainDropdownOptions}
            className="w-full md:w-44 text-[16px] md:text-[24px] cursor-pointer"
            searchEnabled={false}
            onChange={onChainChange}
          />
        </div>
        <div className="flex flex-col gap-1">
          {settingType === "erc721" ? (
            <p className="text-[16px] text-primary-10 font-bold uppercase">
              min <span className="normal-case">NFTs</span> required
            </p>
          ) : (
            <p className="text-[16px] text-primary-10 font-bold uppercase">min tokens required</p>
          )}

          <CreateTextInput
            className="w-full md:w-44 text-[16px] md:text-[24px]"
            type="number"
            min={1}
            value={minTokensRequired}
            placeholder="1"
            onChange={onMinTokensRequiredChange}
          />
          <p className="text-negative-11 text-[14px] font-bold animate-appear">{error?.minTokensRequiredError}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[16px] text-primary-10 font-bold uppercase">token address</p>
          <CreateTextInput
            className="w-full md:w-[600px] text-[16px] md:text-[24px]"
            value={tokenAddress}
            placeholder="0x495f947276749ce646f68ac8c248420045cb7b5e"
            onChange={onTokenAddressChange}
          />
          <p className="text-negative-11 text-[14px] font-bold animate-appear">{error?.tokenAddressError}</p>
        </div>
        {step === "voting" ? (
          <div className="flex flex-col gap-1">
            <p className="text-[16px] text-primary-10 font-bold uppercase">voting power</p>
            <div className="flex justify-between md:justify-normal md:gap-3">
              <CreateTextInput
                className="w-24 md:w-20 text-[16px] md:text-[24px]"
                type="number"
                value={powerValue ?? ""}
                placeholder="100"
                max={MAX_VOTES}
                onChange={onPowerValueChange}
              />
              <p className="text-[16px] md:text-[24px]">votes per</p>
              <CreateDropdown
                value={powerType ?? ""}
                options={votingPowerOptions}
                className="w-full md:w-44 text-[16px] md:text-[24px] cursor-pointer"
                searchEnabled={false}
                onChange={onPowerTypeChange}
              />
            </div>
            <p className="text-negative-11 text-[14px] font-bold animate-appear">{error?.powerValueError}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CreateVotingRequirementsSettings;
