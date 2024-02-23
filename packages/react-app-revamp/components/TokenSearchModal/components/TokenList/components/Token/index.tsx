/* eslint-disable @next/next/no-img-element */
import { FilteredToken } from "@hooks/useTokenList";
import { FC, useState } from "react";

interface TokenSearchListTokenProps {
  token: FilteredToken;
  isChainDropdownOpen?: boolean;
  onSelectToken?: (token: FilteredToken) => void;
}

const TokenSearchListToken: FC<TokenSearchListTokenProps> = ({ token, isChainDropdownOpen, onSelectToken }) => {
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
      onClick={() => onSelectToken?.(token)}
      className={`flex gap-6 items-center cursor-pointer transition-all duration-300 ${
        isChainDropdownOpen ? "opacity-50" : ""
      }`}
    >
      <div
        className={`flex items-center bg-neutral-5 rounded-full overflow-hidden w-10 h-10 border border-primary-2 ${
          isHovered ? "animate-spin" : ""
        }`}
      >
        <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={token.logoURI} alt="avatar" />
      </div>
      <div className="flex flex-col gap-1">
        <p
          className={`text-[20px] text-neutral-11 font-bold normal-case transition-colors duration-300 ${
            isHovered ? "text-primary-10" : ""
          }`}
        >
          {token.symbol}
        </p>
        <p
          className={`text-[16px] text-neutral-11 transition-colors duration-300 ${isHovered ? "text-primary-10" : ""}`}
        >
          {truncateTokenName(token.name)}
        </p>
      </div>
    </div>
  );
};

export default TokenSearchListToken;
