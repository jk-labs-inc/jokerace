import ButtonV3 from "@components/UI/ButtonV3";
import CHAIN_CONFIGS, { ChainConfig, TokenConfig } from "@helpers/tokens";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Reward, useFundRewardsStore } from "@hooks/useFundRewards/store";
import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import Image from "next/image";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { useMedia } from "react-use";

const CreateRewardsFundPool = () => {
  const deployContestData = useDeployContestStore(state => state.deployContestData);
  const { setRewards, setValidationError } = useFundRewardsStore(state => state);
  const [rows, setRows] = useState<Reward[]>([{ address: "", amount: "" }]);
  const isMobile = useMedia("(max-width: 768px)");
  const chainConfig = Object.values(CHAIN_CONFIGS).find(config => config.id === deployContestData.chainId);

  useEffect(() => {
    setRewards(rows);
    const errors = rows.map((row, index) => {
      let error = {};

      // Skip validation if both address and amount are blank
      if (!row.address && (!row.amount || parseFloat(row.amount) === 0)) {
        return error;
      }

      try {
        if (!isTokenShorthand(row.address, chainConfig)) {
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
  }, [rows, setRewards, chainConfig]);

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
    values[index].address = token.address ?? `$${token.shorthand}`;
    setRows(values);
  };

  const isTokenShorthand = (value: string, chainConfig?: ChainConfig) => {
    const tokenShorthands = chainConfig?.tokens.map((token: { shorthand: string }) => token.shorthand);
    const normalizedValue = value.replace("$", ""); // Remove $ sign from the value

    return tokenShorthands?.includes(normalizedValue);
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
              <span className="font-bold uppercase">chain</span> {deployContestData.chain}
            </div>
          </div>

          <div className="text-neutral-11 flex flex-col gap-2">
            <span className="font-bold uppercase">token address</span>
            <input
              className={`bg-neutral-11 rounded-[5px] text-true-black px-2 py-1 placeholder-neutral-10 ${
                isTokenShorthand(row.address, chainConfig) ? "uppercase" : "normal-case"
              }`}
              type="text"
              placeholder="0xA973C55826589f..."
              name="address"
              value={row.address}
              onChange={event => handleInputChange(idx, event)}
            />
          </div>
          <div className="flex gap-2">
            {chainConfig?.tokens.map(token => (
              <div
                key={token.address}
                className="flex items-center gap-2 border-2 border-neutral-10 text-[16px] font-bold uppercase rounded-[10px] px-2 cursor-pointer hover:bg-neutral-4 transition-colors duration-200"
                onClick={() => handleTokenClick(idx, token)}
              >
                <Image src={`/tokens/${token.shorthand}.svg`} width={15} height={15} alt="token" className="mt-[2px]" />
                {token.shorthand}
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
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full md:w-[650px]">
      {isMobile ? (
        lowerDeviceFunding
      ) : (
        <div className="rewards-funding-grid gap-4 text-[16px]">
          <div className="font-bold text-neutral-11 uppercase">#</div>
          <div className="font-bold text-neutral-11 uppercase">chain</div>
          <div className="font-bold text-neutral-11 uppercase">token address</div>
          <div className="font-bold text-neutral-11 uppercase">number of tokens</div>
          {rows.map((row, idx) => (
            <Fragment key={idx}>
              <div className="font-bold text-neutral-11 font-sabo self-center">{idx + 1}</div>
              <div className="self-center">{deployContestData.chain}</div>
              <input
                className={`bg-neutral-11 rounded-[5px] text-true-black px-2 py-1 placeholder-neutral-10 ${
                  isTokenShorthand(row.address, chainConfig) ? "uppercase" : "normal-case"
                }`}
                type="text"
                placeholder="0xA973C5582658933f..."
                name="address"
                value={row.address}
                onChange={event => handleInputChange(idx, event)}
              />
              <input
                className="bg-neutral-11 rounded-[5px] text-right px-2 py-1 text-true-black placeholder-neutral-10 font-bold"
                type="number"
                name="amount"
                placeholder="100"
                value={row.amount}
                onChange={event => handleInputChange(idx, event)}
              />
              <div className={`col-start-3 col-span-2 -mt-[5px] flex gap-2 ${idx < rows.length - 1 ? "mb-5" : ""}`}>
                {chainConfig?.tokens.map(token => (
                  <div
                    key={token.address}
                    className="flex items-center gap-2 border-2 border-neutral-10 text-[16px] font-bold uppercase rounded-[10px] px-2 cursor-pointer hover:bg-neutral-4 transition-colors duration-200"
                    onClick={() => handleTokenClick(idx, token)}
                  >
                    <Image
                      src={`/tokens/${token.shorthand}.svg`}
                      width={15}
                      height={15}
                      alt="token"
                      className="mt-[2px]"
                    />
                    {token.shorthand}
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      )}

      <div className="mt-4 md:mt-0 flex justify-end">
        <ButtonV3 onClick={handleAddField} color="bg-primary-10">
          + add token
        </ButtonV3>
      </div>
    </div>
  );
};

export default CreateRewardsFundPool;
