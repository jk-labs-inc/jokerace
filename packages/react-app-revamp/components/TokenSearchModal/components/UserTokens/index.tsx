import { useFetchUserTokens } from "@hooks/useFetchUserTokens";
import { FilteredToken } from "@hooks/useTokenList";
import { FC } from "react";
import { useAccount } from "wagmi";
import TokenSearchListToken from "../TokenList/components/Token";

interface TokenSearchModalUserTokensProps {
  chainName: string;
  isChainDropdownOpen?: boolean;
  onSelectToken?: (token: FilteredToken) => void;
}

const TokenSearchModalUserTokens: FC<TokenSearchModalUserTokensProps> = ({
  chainName,
  onSelectToken,
  isChainDropdownOpen,
}) => {
  const { address } = useAccount();
  const { isLoading, tokens, error } = useFetchUserTokens(address ?? "", chainName);

  if (!address) return null;

  if (error) {
    return (
      <p className="text-[16px] text-negative-11 font-bold">
        there was an issue while loading tokens, please reload the page.
      </p>
    );
  }

  if (isLoading) {
    return <p className="loadingDots font-sabo text-[14px] text-neutral-14">loading your tokens</p>;
  }

  if (!tokens) return null;

  return (
    <div className="flex flex-col gap-6 animate-appear">
      {tokens.map(token => (
        <TokenSearchListToken
          key={token.address}
          token={token}
          onSelectToken={onSelectToken}
          isChainDropdownOpen={isChainDropdownOpen}
        />
      ))}
    </div>
  );
};

export default TokenSearchModalUserTokens;
