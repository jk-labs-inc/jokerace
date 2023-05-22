import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { createMerkleTreeFromAddresses, Submitter } from "lib/merkletree/generateSubmissionsTree";
import { useState } from "react";
import CSVEditor, { SubmissionFieldObject } from "./components/CSVEditor";

const CreateSubmissionAllowlist = () => {
  const { step, setSubmissionMerkle, setError } = useDeployContestStore(state => state);
  const [allowList, setAllowList] = useState<Submitter[]>();

  const onAllowListChange = (fields: Array<SubmissionFieldObject>) => {
    // Filter out completely empty fields
    const nonEmptyFields = fields.filter(field => field.address !== "");

    const hasError = nonEmptyFields.some(field => field.error !== null);

    if (hasError) {
      setAllowList(undefined);
      return;
    }

    setAllowList(nonEmptyFields);
  };

  const onNextStep = () => {
    if (!allowList) return;

    const merkleSubmissionsData = createMerkleTreeFromAddresses(allowList);

    setSubmissionMerkle(merkleSubmissionsData);
  };

  return (
    <div className="mt-5 ml-[20px]">
      <div className="flex flex-col gap-2 mb-5">
        <p className="text-[24px] font-bold text-primary-10">who can submit?</p>
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

export default CreateSubmissionAllowlist;
