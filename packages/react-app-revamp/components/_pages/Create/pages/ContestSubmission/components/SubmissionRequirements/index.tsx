import CreateNextButton from "@components/_pages/Create/components/Buttons/Next";
import CreateDropdown from "@components/_pages/Create/components/Dropdown";
import { useDeployContestStore } from "@hooks/useDeployContest/store";

const options = ["anyone", "set allowlist manually"];

const CreateSubmissionRequirements = () => {
  const { step, submissionRequirements, setSubmissionRequirements } = useDeployContestStore(state => state);

  const onSubmissionRequirementsChange = (value: string) => {
    setSubmissionRequirements(value);
  };
  return (
    <>
      <div className="flex flex-col gap-5">
        <p className="text-[24px] font-bold text-primary-10">who can submit?</p>
        <CreateDropdown
          value={submissionRequirements}
          options={options}
          width={300}
          searchEnabled={false}
          onChange={onSubmissionRequirementsChange}
        />
      </div>
      <div className="mt-8">
        <CreateNextButton step={step + 1} />
      </div>
    </>
  );
};

export default CreateSubmissionRequirements;
