import { chains } from "@config/wagmi";
import { FC, useState } from "react";
import TokenSearchModalChainDropdown, { Option } from "../components/ChainDropdown";
import TokenSearchModalSearchInput from "../components/SearchInput";
import TokenSearchList from "../components/TokenList";
import TokenSearchModalUserTokens from "../components/UserTokens";
import { FilteredToken } from "@hooks/useTokenList";

interface TokenSearchModalERC20Props {
  chains: Option[];
  hideChains?: boolean;
  onSelectToken?: (token: FilteredToken) => void;
}
const TokenSearchModalERC20: FC<TokenSearchModalERC20Props> = ({ chains: erc20Chains, hideChains, onSelectToken }) => {
  const [erc20SelectedChain, setErc20SelectedChain] = useState<string>(erc20Chains[0].value);
  const [searchValue, setSearchValue] = useState<string>("");
  const chainId = chains.find(chain => chain.name === erc20SelectedChain)?.id || 1;
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {!hideChains ? (
        <div className="flex flex-col gap-4">
          <p className="text-[24px] font-bold text-true-white">chain:</p>
          <TokenSearchModalChainDropdown
            defaultOption={erc20Chains[0]}
            options={erc20Chains}
            onChange={option => setErc20SelectedChain(option)}
            onMenuStateChange={isOpen => setIsChainDropdownOpen(isOpen)}
          />
        </div>
      ) : null}
      {!hideChains ? <div className="bg-primary-5 h-[2px]" /> : null}
      <TokenSearchModalSearchInput
        onSearchChange={value => setSearchValue(value)}
        isChainDropdownOpen={isChainDropdownOpen}
      />
      {searchValue ? (
        <TokenSearchList
          searchValue={searchValue}
          chainId={chainId}
          isChainDropdownOpen={isChainDropdownOpen}
          onSelectToken={onSelectToken}
        />
      ) : (
        <TokenSearchModalUserTokens
          chainName={erc20SelectedChain}
          onSelectToken={onSelectToken}
          isChainDropdownOpen={isChainDropdownOpen}
        />
      )}
    </div>
  );
};

export default TokenSearchModalERC20;
