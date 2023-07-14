import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDropdown, { Option } from "@components/_pages/Create/components/Dropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { generateMerkleTree } from "lib/merkletree/generateMerkleTree";
import { useEffect } from "react";

const options: Option[] = [{ value: "anyone" }, { value: "voters (same requirements)" }];

const CreateSubmissionRequirements = () => {
  const {
    step,
    submissionRequirements,
    setSubmissionRequirements,
    setSubmissionAllowlistFields,
    setSubmissionMerkle,
    votingAllowlistFields,
  } = useDeployContestStore(state => state);
  const submissionRequirementsValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([
    () => submissionRequirementsValidation?.[1].validation(submissionRequirements, "submissionRequirements"),
  ]);

  const onSubmissionRequirementsChange = (value: string) => {
    setSubmissionRequirements(value);
  };

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

  const handleNextStep = () => {
    let submissionMerkleData: Record<string, number> = {};

    if (submissionRequirements === "voters (same requirements)") {
      votingAllowlistFields.forEach(field => {
        if (field.address) {
          submissionMerkleData[field.address] = 10;
        }
      });

      const { merkleRoot, recipients } = generateMerkleTree(18, submissionMerkleData);

      setSubmissionMerkle({ merkleRoot, submitters: recipients });
      setSubmissionAllowlistFields([]);

      onNextStep();
    } else {
      setSubmissionAllowlistFields([]);
      setSubmissionMerkle(null);
      onNextStep();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <p className="text-[20px] md:text-[24px] font-bold text-primary-10">who can submit?</p>
        <CreateDropdown
          value={submissionRequirements}
          options={options}
          className="w-full md:w-[300px] text-[20px]"
          searchEnabled={false}
          onChange={onSubmissionRequirementsChange}
        />
      </div>
      <div className="mt-8">
        <CreateNextButton step={step + 1} onClick={handleNextStep} />
      </div>
    </>
  );
};

export default CreateSubmissionRequirements;
