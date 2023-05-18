import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CSVEditor, { FieldObject } from "@components/_pages/Create/components/CSVEditor";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { createMerkleTreeFromVotes } from "lib/merkletree/generate";
import { useState } from "react";

const CreateVotingAllowlist = () => {
  const { step } = useDeployContestStore(state => state);
  const [allowList, setAllowList] = useState<Record<string, number>>();

  const onAllowListChange = (fields: Array<FieldObject>) => {
    const hasError = fields.some(field => field.error !== null);

    if (hasError) {
      setAllowList(undefined);
      return;
    }

    // Map the array of field objects to a record of string and number
    const newAllowList = fields.reduce((result, field) => {
      result[field.address] = Number(field.votes);
      return result;
    }, {} as Record<string, number>);

    setAllowList(newAllowList);
  };

  const onNextStep = () => {
    if (!allowList) return;

    const merkleStuff = createMerkleTreeFromVotes(18, allowList);

    console.log({ merkleStuff });
  };

  return (
    <div className="mt-5 ml-[20px]">
      <div className="flex flex-col gap-2 mb-5">
        <p className="text-[24px] font-bold text-primary-10">who can vote?</p>
        <p className="text-[16px] text-neutral-11">
          copy-paste allowlist into preview box (up to 100 line items) or upload a csv below <br />
          (no limit on line items).
        </p>
      </div>
      <CSVEditor onChange={onAllowListChange} />

      <div className="mt-8">
        <CreateNextButton step={step + 1} onClick={onNextStep} />
      </div>
    </div>
  );
};

export default CreateVotingAllowlist;
