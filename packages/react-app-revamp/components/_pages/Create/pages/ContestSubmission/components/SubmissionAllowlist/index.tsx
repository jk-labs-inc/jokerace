import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { createMerkleTreeFromAddresses, Submitter } from "lib/merkletree/generateSubmissionsTree";
import { useEffect, useState } from "react";
import CSVEditorSubmission, { SubmissionFieldObject } from "./components/CSVEditor";

const CreateSubmissionAllowlist = () => {
  const { step, setSubmissionMerkle, submissionMerkle, setError } = useDeployContestStore(state => state);
  const [allowList, setAllowList] = useState<Submitter[]>([]);
  const submissionValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => submissionValidation?.[0].validation(allowList, "submissionMerkle")]);

  useEffect(() => {
    if (submissionMerkle) {
      const newAllowList = submissionMerkle.submitters.map(submitter => ({ address: submitter.address }));
      setAllowList(newAllowList);
    }
  }, [submissionMerkle]);

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleNextStep();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [onNextStep]);

  const onAllowListChange = (fields: Array<SubmissionFieldObject>) => {
    const nonEmptyFields = fields.filter(field => field.address !== "");

    const hasError = nonEmptyFields.some(field => field.error === true);

    if (hasError) {
      setAllowList([]);
      return;
    }

    // If there are no errors, map the fields to an array of `Submitter` objects
    setAllowList(nonEmptyFields.map(field => ({ address: field.address })));
  };

  const handleNextStep = () => {
    if (allowList.length === 0) return;

    const { merkleRoot, submitters } = createMerkleTreeFromAddresses(allowList);

    setSubmissionMerkle({ merkleRoot, submitters });
    onNextStep();

    setError(step + 1, { step: step + 1, message: "" });
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
      <CSVEditorSubmission onChange={onAllowListChange} />

      <div className="mt-8">
        <CreateNextButton step={step + 1} onClick={handleNextStep} />
      </div>
    </div>
  );
};

export default CreateSubmissionAllowlist;
