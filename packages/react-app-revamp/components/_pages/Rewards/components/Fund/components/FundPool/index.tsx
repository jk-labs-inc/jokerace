import ButtonV3 from "@components/UI/ButtonV3";
import CHAIN_CONFIGS, { TokenConfig } from "@helpers/tokens";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Reward, useFundRewardsStore } from "@hooks/useFundRewards/store";
import Image from "next/image";
import { ChangeEvent, FC, Fragment, useEffect, useState } from "react";

const CreateRewardsFundPool = () => {
  const deployContestData = useDeployContestStore(state => state.deployContestData);
  const { setRewards } = useFundRewardsStore(state => state);
  const [rows, setRows] = useState<Reward[]>([{ address: "", amount: "" }]);

  useEffect(() => {
    setRewards(rows);
  }, [rows, setRewards]);

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
    values[index].address = token.address ?? token.shorthand;
    setRows(values);
  };

  const chainConfig = Object.values(CHAIN_CONFIGS).find(config => config.id === deployContestData.chainId);

  return (
    <div className="rewards-funding-grid items-center gap-4 w-[550px] text-[16px]">
      <div className="font-bold text-neutral-11 uppercase">chain</div>
      <div className="font-bold text-neutral-11 uppercase">token address</div>
      <div className="font-bold text-neutral-11 uppercase">number of tokens</div>

      {rows.map((row, idx) => (
        <Fragment key={idx}>
          <div>{deployContestData.chain}</div>
          <input
            className="bg-neutral-11 rounded-[5px] text-true-black p-1 placeholder-neutral-10"
            type="text"
            placeholder="0xA973C55826589f..."
            name="address"
            value={row.address}
            onChange={event => handleInputChange(idx, event)}
          />

          <input
            className="bg-neutral-11 rounded-[5px] text-right p-1 text-true-black placeholder-neutral-10"
            type="number"
            name="amount"
            placeholder="100"
            value={row.amount}
            onChange={event => handleInputChange(idx, event)}
          />

          <div className="col-start-2 col-span-2 -mt-[5px] flex gap-2">
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
        </Fragment>
      ))}

      <div className="flex justify-end col-span-3">
        <ButtonV3 onClick={handleAddField} color="bg-primary-10">
          + add token
        </ButtonV3>
      </div>
    </div>
  );
};

export default CreateRewardsFundPool;
