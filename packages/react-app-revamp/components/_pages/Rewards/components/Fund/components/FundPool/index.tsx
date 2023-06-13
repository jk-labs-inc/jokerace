import ButtonV3 from "@components/UI/ButtonV3";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useState, ChangeEvent, Fragment } from "react";

interface Row {
  chainName: string;
  tokenAddress: string;
  numberOfTokens: string;
}

const CreateRewardsFundPool = () => {
  const deployContestData = useDeployContestStore(state => state.deployContestData);
  const [rows, setRows] = useState<Row[]>([{ chainName: "", tokenAddress: "", numberOfTokens: "" }]);

  const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const values = [...rows];
    const { name, value } = event.target;
    values[index] = { ...values[index], [name]: value };
    setRows(values);
  };

  const handleAddField = () => {
    setRows([...rows, { chainName: "", tokenAddress: "", numberOfTokens: "" }]);
  };

  return (
    <div className="grid grid-cols-3 items-center gap-4 w-[550px] text-[16px]">
      <div className="font-bold text-neutral-11 uppercase">chain</div>
      <div className="font-bold text-neutral-11 uppercase">token address</div>
      <div className="font-bold text-neutral-11 uppercase">number of tokens</div>

      {rows.map((row, idx) => (
        <Fragment key={idx}>
          <div>{deployContestData.chain}</div>
          <div className="flex">
            <input
              className="bg-neutral-11 rounded-[5px] text-true-black p-1 placeholder-neutral-10"
              type="text"
              placeholder="0xA973C55826589f..."
              name="tokenAddress"
              value={row.tokenAddress}
              onChange={event => handleInputChange(idx, event)}
            />
            <div className="flex gap-2">
              <p>eth</p>
              <p>usdc</p>
            </div>
          </div>

          <input
            className="bg-neutral-11 rounded-[5px] text-right p-1 text-true-black placeholder-neutral-10"
            type="number"
            name="numberOfTokens"
            placeholder="100"
            value={row.numberOfTokens}
            onChange={event => handleInputChange(idx, event)}
          />
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
