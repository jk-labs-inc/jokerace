import { SubmissionType, useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMemo } from "react";

const CreateSubmissionTabMessage = () => {
  const { submissionTab, submissionTypeOption } = useDeployContestStore(state => state);

  const dynamicTabMessage = useMemo<JSX.Element | null>(() => {
    if (submissionTypeOption.value === SubmissionType.SameAsVoters) return null;

    switch (submissionTab) {
      case 0:
        return (
          <p className="text-[20px] text-neutral-11">
            use presets to save time, but remember:{" "}
            <b>
              you can always upload a csv to <br />
              allowlist any addresses you like.
            </b>
          </p>
        );

      default:
        return null;
    }
  }, [submissionTab, submissionTypeOption]);

  if (submissionTypeOption.value === SubmissionType.SameAsVoters) {
    return (
      <p className="text-[20px] text-neutral-11">
        perfect: let’s define the list of submitters and voters in the next step.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] text-neutral-11">
        if your list of submitters is different from your list of voters, then we can <br />
        define your submitters here.
      </p>
      {dynamicTabMessage}
    </div>
  );
};

export default CreateSubmissionTabMessage;
