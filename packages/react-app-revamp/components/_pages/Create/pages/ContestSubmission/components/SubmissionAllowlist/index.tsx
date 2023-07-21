import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { generateMerkleTree } from "lib/merkletree/generateMerkleTree";
import { useEffect, useState } from "react";
import CSVEditorSubmission, { SubmissionFieldObject } from "./components/CSVEditor";

const CreateSubmissionAllowlist = () => {
  const { step, setSubmissionMerkle, submissionMerkle, setError, submissionAllowList, setSubmissionAllowlist } =
    useDeployContestStore(state => state);
  const submissionValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => submissionValidation?.[0].validation(submissionAllowList)]);

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
    const newAllowList: Record<string, number> = {};

    let hasError = false;
    for (const field of fields) {
      if (field.address === "") continue;

      if (field.error === true) {
        hasError = true;
        break;
      }

      newAllowList[field.address] = 10; // numVotes is hardcoded to 10
    }

    setSubmissionAllowlist(hasError ? {} : newAllowList);
  };

  const handleNextStep = () => {
    if (Object.keys(submissionAllowList).length === 0) return;

    if (submissionMerkle) {
      onNextStep();
      return;
    }

    const { merkleRoot, recipients } = generateMerkleTree(18, submissionAllowList);

    setSubmissionMerkle({ merkleRoot, submitters: recipients });
    onNextStep();
    setError(step + 1, { step: step + 1, message: "" });
  };

  return (
    <div className="mt-5 md:ml-[20px]">
      <div className="flex flex-col gap-2 mb-5">
        <p className="text-[20px] md:text-[24px] font-bold text-primary-10">who can submit?</p>
        <p className="text-[16px] text-neutral-11">
          copy-paste allowlist into preview box (up to 100 line items) or upload a csv below <br />
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
