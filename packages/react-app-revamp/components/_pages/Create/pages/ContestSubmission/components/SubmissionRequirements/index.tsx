import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDropdown, { Option } from "@components/_pages/Create/components/Dropdown";
import { useNextStep } from "@components/_pages/Create/hooks/useNextStep";
import { validationFunctions } from "@components/_pages/Create/utils/validation";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect } from "react";

const options: Option[] = [
  { value: "anyone" },
  { value: "voters (same requirements)", disabled: true },
  { value: "holders of a specific token", disabled: true },
  { value: "custom twitter users", disabled: true },
];

const CreateSubmissionRequirements = () => {
  const { step, submissionRequirements, setSubmissionRequirements, setSubmissionAllowlistFields, setSubmissionMerkle } =
    useDeployContestStore(state => state);
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
    setSubmissionAllowlistFields([]);
    setSubmissionMerkle(null);

    onNextStep();
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <p className="text-[20px] md:text-[24px] font-bold text-primary-10">who can submit?</p>
        <CreateDropdown
          value={submissionRequirements}
          options={options}
          className="w-[300px]"
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
