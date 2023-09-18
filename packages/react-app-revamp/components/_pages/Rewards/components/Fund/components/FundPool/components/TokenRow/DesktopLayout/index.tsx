import { getTokenImage } from "@helpers/getTokenImage";
import { isTokenShorthand } from "@helpers/isTokenShorthand";
import { TokenConfig } from "@helpers/tokens";
import { Reward } from "@hooks/useFundRewards/store";
import Image from "next/image";
import { ChangeEvent, FC } from "react";

interface CreateRewardsFundPoolDesktopLayoutProps {
  rows: Reward[];
  chainName: string;
  allTokens: TokenConfig[];
  handleInputChange?: (idx: number, event: ChangeEvent<HTMLInputElement>) => void;
  handleTokenClick?: (idx: number, token: TokenConfig) => void;
  handleRemoveRow?: (idx: number) => void;
}
const CreateRewardsFundPoolDesktopLayout: FC<CreateRewardsFundPoolDesktopLayoutProps> = ({
  rows,
  chainName,
  allTokens,
  handleInputChange,
  handleTokenClick,
  handleRemoveRow,
}) => {
  return (
    <div>
      <div className="rewards-funding-grid gap-4 text-[16px] group items-center mb-[15px]">
        <div className="font-bold text-neutral-11 uppercase font-sabo">#</div>
        <div className="font-bold text-neutral-11 uppercase">chain</div>
        <div className="font-bold text-neutral-11 uppercase -ml-[5px]">token address</div>
        <div className="font-bold text-neutral-11 uppercase -ml-[10px]">number of tokens</div>
        <div></div>
      </div>
      {rows.map((row, idx) => (
        <div key={idx} className="rewards-funding-grid gap-4 text-[16px] items-center group">
          <div className="font-bold text-neutral-11 font-sabo self-center text-[18px] mt-[5px]">{idx + 1}</div>
          <div className="self-center">{chainName}</div>
          <input
            className={`bg-neutral-11 rounded-[5px] text-true-black px-2 py-1 placeholder-neutral-10 ${
              isTokenShorthand(allTokens, row.address) ? "uppercase" : "normal-case"
            }`}
            type="text"
            placeholder="0xA973C5582658933f..."
            name="address"
            value={row.address}
            onChange={event => handleInputChange?.(idx, event)}
          />
          <input
            className="bg-neutral-11 rounded-[5px] text-right px-2 py-1 text-true-black placeholder-neutral-10 placeholder-font-bold"
            type="number"
            name="amount"
            placeholder="100"
            value={row.amount}
            onChange={event => handleInputChange?.(idx, event)}
          />
          {rows.length > 1 && (
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              onClick={() => handleRemoveRow?.(idx)}
            >
              <Image src="/create-flow/trashcan.png" width={18} height={18} alt="trashcan" />
            </div>
          )}

          <div className={`col-start-3 col-span-3 -mt-[5px] flex gap-2 ${idx < rows.length - 1 ? "mb-8" : ""}`}>
            {allTokens.map(token => (
              <div
                key={token.address}
                className="flex items-center gap-2 border-2 border-neutral-10 text-[16px] font-bold uppercase rounded-[10px] px-2 cursor-pointer hover:bg-neutral-4 transition-colors duration-200"
                onClick={() => handleTokenClick?.(idx, token)}
              >
                <Image src={getTokenImage(token, chainName)} width={20} height={20} alt="token" className="mt-[2px]" />
                {token.symbol}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreateRewardsFundPoolDesktopLayout;
