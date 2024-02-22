/* eslint-disable @next/next/no-img-element */
import TokenSearchModal, { TokenSearchModalType } from "@components/TokenSearchModal";
import { chainsImages } from "@config/wagmi";
import { ChevronDownIcon, XIcon } from "@heroicons/react/outline";
import { NFTMetadata } from "@hooks/useSearchNfts";
import { FilteredToken } from "@hooks/useTokenList";
import Image from "next/image";
import { FC, useState } from "react";
import CreateDefaultDropdown, { Option } from "../DefaultDropdown";
import CreateNumberInput from "../NumberInput";
import { erc20ChainDropdownOptions, nftChainDropdownOptions, votingPowerOptions } from "./config";

interface CreateRequirementsSettingsProps {
  step: "voting" | "submission";
  settingType: string;
  chain: string;
  token: TokenDetails;
  minTokensRequired: number;
  powerType?: string;
  powerValue?: number;
  error?: Record<string, string | undefined>;
  onChainChange?: (chain: string) => void;
  onTokenChange?: (token: TokenDetails) => void;
  onMinTokensRequiredChange?: (minTokens: number | null) => void;
  onPowerTypeChange?: (votingPowerType: string) => void;
  onPowerValueChange?: (votingPower: number | null) => void;
}

export interface TokenDetails {
  address: string;
  name: string;
  logo: string;
}

const CreateRequirementsSettings: FC<CreateRequirementsSettingsProps> = ({
  step,
  settingType,
  chain,
  token,
  minTokensRequired,
  error,
  powerType,
  powerValue,
  onChainChange,
  onTokenChange,
  onMinTokensRequiredChange,
  onPowerTypeChange,
  onPowerValueChange,
}) => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const chainDropdownOptions = settingType === "erc20" ? erc20ChainDropdownOptions : nftChainDropdownOptions;
  const tokenModalType = settingType === "erc20" ? TokenSearchModalType.ERC20 : TokenSearchModalType.ERC721;
  const [tokenDetails, setTokenDetails] = useState<TokenDetails>(token);
  const tokenDetailsExist = tokenDetails.name && tokenDetails.logo;
  const [chainLogo, setChainLogo] = useState<string>("/mainnet.svg");

  const powerTypeOption = (powerType: string): Option => {
    return {
      value: powerType,
      label: powerType,
    };
  };

  const onTokenSelectHandler = (token: FilteredToken) => {
    const { name, logoURI, address } = token;
    setIsTokenModalOpen(false);
    setTokenDetails({
      name,
      address,
      logo: token.logoURI,
    });
    onTokenChange?.({
      name,
      address,
      logo: token.logoURI,
    });
  };

  const onNftSelectHandler = (nft: NFTMetadata) => {
    const { name, imageUrl, address } = nft;
    setIsTokenModalOpen(false);
    setTokenDetails({
      name,
      address,
      logo: nft.imageUrl,
    });
    onTokenChange?.({
      name,
      address,
      logo: nft.imageUrl,
    });
  };

  const onRemoveToken = () => {
    setTokenDetails({
      name: "",
      logo: "",
      address: "",
    });
    onTokenChange?.({
      name: "",
      logo: "",
      address: "",
    });
  };

  const onTokenModalHandler = () => {
    if (tokenDetails.name && tokenDetails.logo) return;

    setIsTokenModalOpen(!isTokenModalOpen);
  };

  const onChainChangeHandler = (chain: string) => {
    const chainLogo = chainsImages[chain];
    setChainLogo(chainLogo);
    onChainChange?.(chain);
  };

  return (
    <div className="md:ml-4 md:pl-4 md:border-l border-true-white mt-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <Image src={chainLogo} alt="ethereum" width={20} height={20} />
            <p className="text-[16px] text-neutral-11 font-bold uppercase">
              {settingType === "erc20" ? "token" : "nft"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div
              onClick={onTokenModalHandler}
              className={`flex  rounded-[15px] border border-neutral-10 bg-transparent justify-between w-[216px] h-10 px-4 py-1 ${
                tokenDetailsExist ? "hover:border-negative-11" : "hover:border-neutral-11 "
              }  transition-all duration-300 cursor-pointer`}
            >
              {tokenDetailsExist ? (
                <div className="flex gap-3 items-center">
                  <div
                    className={`flex items-center bg-neutral-5 rounded-full overflow-hidden w-8 border border-primary-2`}
                  >
                    <img
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      src={tokenDetails.logo}
                      alt="avatar"
                    />
                  </div>
                  {/* //TODO: truncate token name */}
                  <p className="text-[20px] text-neutral-11 uppercase">{tokenDetails.name.substring(0, 5)}</p>
                </div>
              ) : (
                <p className="text-[20px] font-bold text-neutral-10">select...</p>
              )}

              {tokenDetailsExist ? (
                <XIcon
                  className="w-6 cursor-pointer text-negative-11 hover:text-negative-10 transition-all duration-300"
                  onClick={onRemoveToken}
                />
              ) : (
                <ChevronDownIcon className="w-6 cursor-pointer text-neutral-11" />
              )}
            </div>
            {error?.tokenAddressError ? (
              <p className="text-negative-11 text-[14px] font-bold animate-fadeIn">{error.tokenAddressError}</p>
            ) : null}
          </div>
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

        {step === "voting" ? (
          <div className="flex flex-col gap-4">
            <p className="text-[16px] text-neutral-11 font-bold uppercase">voting power</p>
            <div className="flex flex-col gap-2">
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
          </div>
        ) : null}
        <TokenSearchModal
          type={tokenModalType}
          chains={chainDropdownOptions}
          isOpen={isTokenModalOpen}
          setIsOpen={value => setIsTokenModalOpen(value)}
          onSelectToken={onTokenSelectHandler}
          onSelectNft={onNftSelectHandler}
          onSelectChain={onChainChangeHandler}
          onClose={() => setChainLogo("/mainnet.svg")}
        />
      </div>
    </div>
  );
};

export default CreateRequirementsSettings;
