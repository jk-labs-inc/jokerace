import { SubmissionType, SubmissionTypeOption, useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMediaQuery } from "react-responsive";

const submissionTypeOptions: SubmissionTypeOption[] = [
  { value: SubmissionType.DifferentFromVoters, label: "yes, they’re different" },
  { value: SubmissionType.SameAsVoters, label: "they’re the exact same" },
];

const CreateSubmissionType = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { submissionTypeOption, setSubmissionTypeOption } = useDeployContestStore(state => state);
  const submissionTypeTitle = isMobile
    ? "is the list of people who can submit different from the people who can vote?"
    : "are the people who can submit different from the people who can vote?";

  const onChange = (value: SubmissionTypeOption) => {
    setSubmissionTypeOption(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[20px] text-neutral-11">{submissionTypeTitle}</p>
      <div className="flex items-center justify-center w-full md:w-[432px] h-10 border border-neutral-10 overflow-hidden rounded-[25px] text-[20px] bg-true-black">
        <div
          className={`flex-1 h-full pt-1 w-full text-center cursor-pointer transition-colors duration-200 ${
            submissionTypeOption.value === SubmissionType.DifferentFromVoters
              ? "bg-neutral-14 text-true-black font-bold"
              : "text-neutral-11"
          }`}
          onClick={() => onChange(submissionTypeOptions[0])}
        >
          {isMobile ? "yes" : "yes, they’re different"}
        </div>
        <div
          className={`flex-1 h-full pt-1 w-full text-center cursor-pointer transition-colors duration-200  ${
            submissionTypeOption.value === SubmissionType.SameAsVoters
              ? "bg-neutral-14 text-true-black font-bold"
              : "text-neutral-11"
          }`}
          onClick={() => onChange(submissionTypeOptions[1])}
        >
          {isMobile ? (
            "no"
          ) : (
            <>
              <span>they’re the </span>
              <i>exact same</i>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSubmissionType;
