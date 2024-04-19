import { SubmissionType, useDeployContestStore } from "@hooks/useDeployContest/store";
import { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

const CreateSubmissionTabMessage = () => {
  const { submissionTab, submissionTypeOption } = useDeployContestStore(state => state);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const dynamicTabMessage = useMemo<JSX.Element | null>(() => {
    if (submissionTypeOption.value === SubmissionType.SameAsVoters) return null;

    switch (submissionTab) {
      case 0:
        return (
          <p className="text-[20px] text-neutral-11">
            use presets to save time, but remember:{" "}
            <b>
              you can always upload a csv to {isMobile ? " " : <br />}
              allowlist any addresses you like.
            </b>
          </p>
        );

      default:
        return null;
    }
  }, [isMobile, submissionTab, submissionTypeOption.value]);

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
        if your list of submitters is different from your list of voters, then we can {isMobile ? " " : <br />}
        define your submitters here.
      </p>
      {dynamicTabMessage}
    </div>
  );
};

export default CreateSubmissionTabMessage;
