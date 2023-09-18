import ButtonV3 from "@components/UI/ButtonV3";
import { getTokenImage } from "@helpers/getTokenImage";
import { isTokenShorthand } from "@helpers/isTokenShorthand";
import { TokenConfig } from "@helpers/tokens";
import { Reward } from "@hooks/useFundRewards/store";
import Image from "next/image";
import { ChangeEvent, FC } from "react";

interface CreateRewardsFundPoolMobileLayoutProps {
  rows: Reward[];
  chainName: string;
  allTokens: TokenConfig[];
  handleInputChange?: (idx: number, event: ChangeEvent<HTMLInputElement>) => void;
  handleTokenClick?: (idx: number, token: TokenConfig) => void;
  handleRemoveRow?: (idx: number) => void;
}

const CreateRewardsFundPoolMobileLayout: FC<CreateRewardsFundPoolMobileLayoutProps> = ({
  rows,
  chainName,
  allTokens,
  handleInputChange,
  handleTokenClick,
  handleRemoveRow,
}) => {
  return (
    <div className="flex flex-col gap-10">
      {rows.map((row, idx) => (
        <div className="flex flex-col gap-4 text-[16px]" key={idx}>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-[50px] h-[50px] bg-primary-10 rounded-full text-neutral-0 font-bold">
              {idx + 1}
            </div>
            <div className="text-neutral-11 flex flex-col gap-2">
              <span className="font-bold uppercase">chain</span> {chainName}
            </div>
          </div>

          <div className="text-neutral-11 flex flex-col gap-2">
            <span className="font-bold uppercase">token address</span>
            <input
              className={`bg-neutral-11 rounded-[5px] text-true-black px-2 py-1 placeholder-neutral-10 ${
                isTokenShorthand(allTokens, row.address) ? "uppercase" : "normal-case"
              }`}
              type="text"
              placeholder="0xA973C55826589f..."
              name="address"
              value={row.address}
              onChange={event => handleInputChange?.(idx, event)}
            />
          </div>
          <div className="flex gap-2">
            {allTokens.map(token => (
              <div
                key={token.address}
                className="flex items-center gap-2 border-2 border-neutral-10 text-[16px] font-bold uppercase rounded-[10px] px-2 cursor-pointer hover:bg-neutral-4 transition-colors duration-200"
                onClick={() => handleTokenClick?.(idx, token)}
              >
                <Image src={getTokenImage(token, chainName)} width={15} height={15} alt="token" className="mt-[2px]" />
                {token.symbol}
              </div>
            ))}
          </div>
          <div className="text-neutral-11 flex flex-col">
            <span className="font-bold uppercase">number of tokens</span>
            <input
              className="bg-neutral-11 rounded-[5px] text-left p-1 text-true-black placeholder-neutral-10 font-bold"
              type="number"
              name="amount"
              placeholder="100"
              value={row.amount}
              onChange={event => handleInputChange?.(idx, event)}
            />
          </div>

          {rows.length > 1 && (
            <ButtonV3 color="bg-negative-11 text-true-black" onClick={() => handleRemoveRow?.(idx)}>
              remove token
            </ButtonV3>
          )}
        </div>
      ))}
    </div>
  );
};

export default CreateRewardsFundPoolMobileLayout;
