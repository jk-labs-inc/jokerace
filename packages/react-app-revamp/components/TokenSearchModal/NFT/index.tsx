import { chains as wagmiChains } from "@config/wagmi";
import { NFTMetadata } from "@hooks/useSearchNfts";
import { FC, useState } from "react";
import TokenSearchModalChainDropdown from "../components/ChainDropdown";
import NftsSearchList from "../components/NftList";
import TokenSearchModalSearchInput from "../components/SearchInput";
import { Option } from "../types";

interface TokenSearchModalNftProps {
  chains: Option[];
  onSelectNft?: (nft: NFTMetadata) => void;
  onSelectChain?: (chain: string) => void;
}

const TokenSearchModalNft: FC<TokenSearchModalNftProps> = ({ chains, onSelectNft, onSelectChain }) => {
  const [selectedChain, setSelectedChain] = useState<string>(chains[0].value);
  const [searchValue, setSearchValue] = useState<string>("");
  const chainId = wagmiChains.find(chain => chain.name.toLowerCase() === selectedChain.toLowerCase())?.id || 1;

  const onNftChainChange = (chain: string) => {
    setSelectedChain(chain);
    onSelectChain?.(chain);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-[24px] font-bold text-true-white">chain:</p>
        <TokenSearchModalChainDropdown defaultOption={chains[0]} options={chains} onChange={onNftChainChange} />
      </div>
      <div className="bg-primary-5 h-[2px]" />
      <TokenSearchModalSearchInput onSearchChange={value => setSearchValue(value)} chainId={chainId} />
      {searchValue ? (
        <NftsSearchList selectedChain={selectedChain} searchValue={searchValue} onSelectNft={onSelectNft} />
      ) : null}
    </div>
  );
};

export default TokenSearchModalNft;
