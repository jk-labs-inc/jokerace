/* eslint-disable @next/next/no-img-element */
import { formatNumber } from "@helpers/formatNumber";
import { BadgeCheckIcon } from "@heroicons/react/24/outline";
import { NFTMetadata } from "@hooks/useSearchNfts";
import { FC, useState } from "react";

interface TokenSearchListNftProps {
  nft: NFTMetadata;
  isChainDropdownOpen?: boolean;
  onSelectNft?: (nft: NFTMetadata) => void;
}

const TokenSearchListNft: FC<TokenSearchListNftProps> = ({ nft, isChainDropdownOpen, onSelectNft }) => {
  const [isHovered, setIsHovered] = useState(false);

  const truncateTokenName = (name: string, maxLength: number = 30): string => {
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "...";
    }
    return name;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectNft?.(nft)}
      className={`flex gap-6 items-center cursor-pointer transition-all duration-300 ${
        isChainDropdownOpen ? "opacity-50" : ""
      }`}
    >
      <div
        className={`flex items-center bg-neutral-5 rounded-full overflow-hidden w-10 h-10 border border-primary-2 ${
          isHovered ? "animate-spin" : ""
        }`}
      >
        <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={nft.imageUrl} alt="avatar" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 items-center">
          <p
            className={`text-[20px] text-neutral-11 font-bold normal-case transition-colors duration-300 ${
              isHovered ? "text-primary-10" : ""
            }`}
          >
            {truncateTokenName(nft.name)}
          </p>
          {nft.isVerified ? <BadgeCheckIcon width={20} className="text-blue" /> : null}
        </div>

        <p
          className={`text-[16px] text-neutral-11 transition-colors duration-300 ${isHovered ? "text-primary-10" : ""}`}
        >
          {nft.totalSupply ? `${formatNumber(parseFloat(nft.totalSupply))} items` : "no supply available"}
        </p>
      </div>
    </div>
  );
};

export default TokenSearchListNft;
