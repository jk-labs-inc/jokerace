import { FilteredToken, useTokenList } from "@hooks/useTokenList";
import { FC } from "react";
import TokenSearchListToken from "./components/Token";
import { ChevronUpIcon } from "@heroicons/react/outline";

interface TokenSearchTokenListProps {
  searchValue: string;
  chainId: number;
  isChainDropdownOpen?: boolean;
  onSelectToken?: (token: FilteredToken) => void;
}

const TokenSearchList: FC<TokenSearchTokenListProps> = ({
  searchValue,
  chainId,
  isChainDropdownOpen,
  onSelectToken,
}) => {
  const { error, tokens, fetchTokenListPerPage, hasMore, loading } = useTokenList(chainId, searchValue);

  if (error) {
    return (
      <p className="text-[16px] text-negative-11 font-bold">
        there was an issue while loading tokens, please reload the page.
      </p>
    );
  }

  if (loading) {
    return <p className="loadingDots font-sabo text-[14px] text-neutral-14">loading token results</p>;
  }

  if (!tokens.length) {
    return <p className="text-[16px] text-neutral-14 font-sabo uppercase">token not found</p>;
  }

  return (
    <div className="flex flex-col gap-6 animate-reveal">
      {tokens.map(token => (
        <TokenSearchListToken
          key={token.address}
          token={token}
          onSelectToken={onSelectToken}
          isChainDropdownOpen={isChainDropdownOpen}
        />
      ))}
      {hasMore ? (
        <div className="flex gap-2 items-center mb-8 cursor-pointer" onClick={() => fetchTokenListPerPage()}>
          <p className="text-[16px] text-positive-11 font-bold uppercase hover:text-positive-10 transition-color duration-300">
            load more
          </p>
          <button
            className="transition-transform duration-500 ease-in-out transform 
            rotate-180"
          >
            <ChevronUpIcon height={20} className="text-positive-11" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default TokenSearchList;
