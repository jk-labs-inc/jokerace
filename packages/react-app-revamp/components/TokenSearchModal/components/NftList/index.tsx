import { NFTMetadata } from "@hooks/useSearchNfts";
import { FC } from "react";
import TokenSearchListNft from "./component/Nft";

interface NftsSearchListProps {
  nfts: NFTMetadata[] | undefined;
  isChainDropdownOpen?: boolean;
  onSelectNft?: (nft: NFTMetadata) => void;
}

const NftsSearchList: FC<NftsSearchListProps> = ({ nfts, isChainDropdownOpen, onSelectNft }) => {
  if (!nfts) return null;

  return (
    <div className={`flex flex-col gap-6 animate-fadeIn`}>
      {nfts.map(nft => (
        <TokenSearchListNft
          key={nft.address}
          nft={nft}
          onSelectNft={onSelectNft}
          isChainDropdownOpen={isChainDropdownOpen}
        />
      ))}
    </div>
  );
};

export default NftsSearchList;
