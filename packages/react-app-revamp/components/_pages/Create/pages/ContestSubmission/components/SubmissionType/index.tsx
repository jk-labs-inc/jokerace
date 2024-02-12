import React from "react";
import { SubmissionType, SubmissionTypeOption, useDeployContestStore } from "@hooks/useDeployContest/store";

const submissionTypeOptions: SubmissionTypeOption[] = [
  { value: SubmissionType.DifferentFromVoters, label: "different from voters" },
  { value: SubmissionType.SameAsVoters, label: "same people as voters" },
];

const CreateSubmissionType = () => {
  const { submissionTypeOption, setSubmissionTypeOption } = useDeployContestStore(state => state);

  const onChange = (value: SubmissionTypeOption) => {
    setSubmissionTypeOption(value);
  };

  return (
    <div className="flex items-center justify-center w-full md:w-[432px] h-10 border border-neutral-10  overflow-hidden rounded-[25px] text-[20px] bg-true-black">
      {submissionTypeOptions.map((option, index) => (
        <div
          key={index}
          className={`flex-1 h-full pt-1 w-full text-center cursor-pointer transition-colors duration-200 ${
            submissionTypeOption.value === option.value ? "bg-neutral-14 text-true-black font-bold" : "text-neutral-11"
          } `}
          onClick={() => onChange(option)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default CreateSubmissionType;
