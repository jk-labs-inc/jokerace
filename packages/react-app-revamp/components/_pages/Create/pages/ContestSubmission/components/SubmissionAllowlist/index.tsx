import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { generateMerkleTree } from "lib/merkletree/generateMerkleTree";
import { useEffect, useState } from "react";
import CSVEditorSubmission, { SubmissionFieldObject } from "./components/CSVEditor";

const CreateSubmissionAllowlist = () => {
  const { step, setSubmissionMerkle, submissionMerkle, setError } = useDeployContestStore(state => state);
  const submissionValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => submissionValidation?.[0].validation(allowList)]);
  const [allowList, setAllowList] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!submissionMerkle) return;

    const newAllowList = submissionMerkle.submitters.reduce((acc, field) => {
      // We don't need to convert from BigNumber to normal number as numVotes is always hardcoded to 10
      acc[field.address] = 10;
      return acc;
    }, {} as Record<string, number>);

    setAllowList(newAllowList);
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
      setAllowList({});
      return;
    }

    const newAllowList: Record<string, number> = {};
    nonEmptyFields.forEach(field => {
      newAllowList[field.address] = 10; // numVotes is hardcoded to 10
    });
    setAllowList(newAllowList);
  };

  const handleNextStep = () => {
    if (Object.keys(allowList).length === 0) return;

    const { merkleRoot, recipients } = generateMerkleTree(18, allowList);

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
