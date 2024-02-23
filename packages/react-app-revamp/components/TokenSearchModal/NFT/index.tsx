import useSearchNfts, { NFTMetadata } from "@hooks/useSearchNfts";
import { FC, useState } from "react";
import TokenSearchModalChainDropdown, { Option } from "../components/ChainDropdown";
import NftsSearchList from "../components/NftList";
import TokenSearchModalSearchInput from "../components/SearchInput";

interface TokenSearchModalNftProps {
  chains: Option[];
  onSelectNft?: (nft: NFTMetadata) => void;
  onSelectChain?: (chain: string) => void;
}

const TokenSearchModalNft: FC<TokenSearchModalNftProps> = ({ chains, onSelectNft, onSelectChain }) => {
  const [selectedChain, setSelectedChain] = useState<string>(chains[0].value);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);

  const onNftChainChange = (chain: string) => {
    setSelectedChain(chain);
    onSelectChain?.(chain);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">chain:</p>
        <TokenSearchModalChainDropdown
          defaultOption={chains[0]}
          options={chains}
          onChange={onNftChainChange}
          onMenuStateChange={isOpen => setIsChainDropdownOpen(isOpen)}
        />
      </div>
      <div className="bg-primary-5 h-[2px]" />
      <TokenSearchModalSearchInput
        onSearchChange={value => setSearchValue(value)}
        isChainDropdownOpen={isChainDropdownOpen}
      />
      {searchValue ? (
        <NftsSearchList
          selectedChain={selectedChain}
          searchValue={searchValue}
          onSelectNft={onSelectNft}
          isChainDropdownOpen={isChainDropdownOpen}
        />
      ) : null}
    </div>
  );
};

export default TokenSearchModalNft;
