import React from "react";
import { SubmissionType, SubmissionTypeOption, useDeployContestStore } from "@hooks/useDeployContest/store";

const submissionTypeOptions: SubmissionTypeOption[] = [
  { value: SubmissionType.DifferentFromVoters, label: "yes, they’re different" },
  { value: SubmissionType.SameAsVoters, label: "they’re the exact same" },
];

const CreateSubmissionType = () => {
  const { submissionTypeOption, setSubmissionTypeOption } = useDeployContestStore(state => state);

  const onChange = (value: SubmissionTypeOption) => {
    setSubmissionTypeOption(value);
  };

  //TODO: make they are the exactg same italic
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[20px] text-neutral-11">
        are the people who can submit different from the people who can vote?
      </p>
      <div className="flex items-center justify-center w-full md:w-[432px] h-10 border border-neutral-10  overflow-hidden rounded-[25px] text-[20px] bg-true-black">
        {submissionTypeOptions.map((option, index) => (
          <div
            key={index}
            className={`flex-1 h-full pt-1 w-full text-center cursor-pointer transition-colors duration-200 ${
              submissionTypeOption.value === option.value
                ? "bg-neutral-14 text-true-black font-bold"
                : "text-neutral-11"
            } `}
            onClick={() => onChange(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateSubmissionType;
