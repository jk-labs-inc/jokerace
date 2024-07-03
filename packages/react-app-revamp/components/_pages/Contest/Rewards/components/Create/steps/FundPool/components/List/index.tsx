/* eslint-disable @next/next/no-img-element */
import { ClipboardIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { FundPoolToken, useFundPoolStore } from "../../store";
import { formatBalance } from "@helpers/formatBalance";

interface FundPoolTokenListProps {
  tokens: FundPoolToken[];
  onRemoveToken?: (address: string) => void;
}

const FundPoolTokenList: FC<FundPoolTokenListProps> = ({ tokens, onRemoveToken }) => {
  const setTokens = useFundPoolStore(state => state.setTokens);

  const handleRemoveToken = (address: string) => {
    const updatedTokens = tokens.filter(token => token.address !== address);
    setTokens(updatedTokens);
    onRemoveToken?.(address);
  };

  return (
    <div className="flex flex-col w-full gap-4 animate-reveal self-start pl-6 pr-6 pb-6">
      {tokens.map(token => (
        <div className="flex justify-between items-center" key={token.address}>
          <div className="flex gap-4 items-center">
            <div className="flex items-center bg-neutral-5 rounded-full overflow-hidden w-8 h-8 border border-primary-2">
              <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={token.logoURI} alt="avatar" />
            </div>
            <div className="flex flex-col">
              <p className="text-[16px] font-bold text-neutral-11">{formatBalance(token.amount)}</p>
              <p className="text-[14px] text-neutral-14 uppercase">{token.symbol}</p>
            </div>
          </div>
          <TrashIcon
            width={26}
            height={26}
            className="text-negative-11 cursor-pointer hover:text-negative-10 transition-colors duration-300"
            onClick={() => handleRemoveToken(token.address)}
          />
        </div>
      ))}
    </div>
  );
};

export default FundPoolTokenList;
