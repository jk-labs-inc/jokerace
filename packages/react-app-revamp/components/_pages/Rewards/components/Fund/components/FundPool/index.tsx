/* eslint-disable react-hooks/exhaustive-deps */
import ButtonV3 from "@components/UI/ButtonV3";
import { chains, chainsImages } from "@config/wagmi";
import CHAIN_CONFIGS, { ChainConfig, TokenConfig } from "@helpers/tokens";
import { Reward, useFundRewardsStore } from "@hooks/useFundRewards/store";
import { getAddress } from "ethers/lib/utils";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { useMedia } from "react-use";

type NativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
};

const formatNativeToken = (nativeToken?: NativeCurrency): TokenConfig | undefined => {
  if (!nativeToken) return undefined;

  return {
    symbol: nativeToken.symbol,
    name: nativeToken.name,
    address: "",
  };
};

const CreateRewardsFundPool = () => {
  const { asPath } = useRouter();
  const chainName = asPath.split("/")[2];
  const chainId = chains.filter(chain => chain.name.toLowerCase().replace(" ", "") === chainName)?.[0]?.id;
  const { setRewards, setValidationError } = useFundRewardsStore(state => state);
  const [rows, setRows] = useState<Reward[]>([{ address: "", amount: "" }]);
  const isMobile = useMedia("(max-width: 768px)");
  const chainConfig = Object.values(CHAIN_CONFIGS).find(config => config.id === chainId);
  const nativeToken: NativeCurrency | undefined = chains.find(chain => chain.id === chainId)?.nativeCurrency;
  const nativeTokenConfig = formatNativeToken(nativeToken);
  const allTokens = (nativeTokenConfig ? [nativeTokenConfig] : []).concat(chainConfig?.tokens || []);

  useEffect(() => {
    setRewards(rows);
    const errors = rows.map((row, index) => {
      let error = {};

      // Skip validation if both address and amount are blank
      if (!row.address && (!row.amount || parseFloat(row.amount) === 0)) {
        return error;
      }

      try {
        if (!isTokenShorthand(row.address)) {
          getAddress(row.address);
        }
      } catch {
        error = { ...error, tokenAddress: "Invalid Ethereum address." };
      }

      if (row.address && (!row.amount || parseFloat(row.amount) <= 0)) {
        error = { ...error, amount: "Token amount should not be zero." };
      }
      return error;
    });

    const hasErrors = errors.some(error => Object.keys(error).length !== 0);
    setValidationError(hasErrors ? errors : []);
  }, [rows, setRewards, chainConfig, setValidationError]);

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const values = [...rows];
    const { name, value } = event.target;
    values[index] = { ...values[index], [name]: value };
    setRows(values);
  };

  const handleAddField = () => {
    setRows([...rows, { address: "", amount: "" }]);
  };

  const handleTokenClick = (index: number, token: TokenConfig) => {
    const values = [...rows];
    if (!token.address) {
      values[index].address = `$${token.symbol}`;
    } else {
      values[index].address = token.address;
    }

    setRows(values);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length > 1) {
      const newRows = [...rows];
      newRows.splice(index, 1);
      setRows(newRows);
    }
  };

  const isTokenShorthand = (value: string) => {
    const tokenShorthands = allTokens.map((token: { symbol: string }) => token.symbol);
    const normalizedValue = value.replace("$", ""); // Remove $ sign from the value

    return tokenShorthands?.includes(normalizedValue);
  };

  const getTokenImage = (token: TokenConfig) => {
    if (token.address) {
      return `/tokens/${token.name}.svg`;
    } else if (token.symbol === "ETH") {
      return "/tokens/ether.svg";
    } else {
      return chainsImages[chainName.toLowerCase().replace(" ", "")];
    }
  };

  const lowerDeviceFunding = (
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
                isTokenShorthand(row.address) ? "uppercase" : "normal-case"
              }`}
              type="text"
              placeholder="0xA973C55826589f..."
              name="address"
              value={row.address}
              onChange={event => handleInputChange(idx, event)}
            />
          </div>
          <div className="flex gap-2">
            {allTokens.map(token => (
              <div
                key={token.address}
                className="flex items-center gap-2 border-2 border-neutral-10 text-[16px] font-bold uppercase rounded-[10px] px-2 cursor-pointer hover:bg-neutral-4 transition-colors duration-200"
                onClick={() => handleTokenClick(idx, token)}
              >
                <Image src={getTokenImage(token)} width={15} height={15} alt="token" className="mt-[2px]" />
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
              onChange={event => handleInputChange(idx, event)}
            />
          </div>

          {rows.length > 1 && (
            <ButtonV3 color="bg-negative-11 text-true-black" onClick={() => handleRemoveRow(idx)}>
              remove token
            </ButtonV3>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full md:w-[750px]">
      {isMobile ? (
        lowerDeviceFunding
      ) : (
        <>
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
                  isTokenShorthand(row.address) ? "uppercase" : "normal-case"
                }`}
                type="text"
                placeholder="0xA973C5582658933f..."
                name="address"
                value={row.address}
                onChange={event => handleInputChange(idx, event)}
              />
              <input
                className="bg-neutral-11 rounded-[5px] text-right px-2 py-1 text-true-black placeholder-neutral-10 placeholder-font-bold"
                type="number"
                name="amount"
                placeholder="100"
                value={row.amount}
                onChange={event => handleInputChange(idx, event)}
              />
              {rows.length > 1 && (
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={() => handleRemoveRow(idx)}
                >
                  <Image src="/create-flow/trashcan.png" width={18} height={18} alt="trashcan" />
                </div>
              )}

              <div className={`col-start-3 col-span-3 -mt-[5px] flex gap-2 ${idx < rows.length - 1 ? "mb-8" : ""}`}>
                {allTokens.map(token => (
                  <div
                    key={token.address}
                    className="flex items-center gap-2 border-2 border-neutral-10 text-[16px] font-bold uppercase rounded-[10px] px-2 cursor-pointer hover:bg-neutral-4 transition-colors duration-200"
                    onClick={() => handleTokenClick(idx, token)}
                  >
                    <Image src={getTokenImage(token)} width={20} height={20} alt="token" className="mt-[2px]" />
                    {token.symbol}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      <div className="flex justify-end md:rewards-funding-grid">
        <div className="col-start-4 col-span-1 justify-self-end mt-[15px] md:-mt-[5px]">
          <ButtonV3 onClick={handleAddField} color="bg-primary-10">
            + add token
          </ButtonV3>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardsFundPool;
