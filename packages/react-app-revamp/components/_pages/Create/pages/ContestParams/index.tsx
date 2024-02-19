import { MAX_SUBMISSIONS_LIMIT, useDeployContest } from "@hooks/useDeployContest";
import { ContestVisibility, useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect, useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import ContestParamsVisibility from "./components/ContestVisibility";
import ContestParamsDownvote from "./components/Downvote";
import ContestParamsSubmissionsPerContest from "./components/SubmissionsPerContest";
import ContestParamsSubmissionsPerPlayer from "./components/SubmissionsPerPlayer";

const CreateContestParams = () => {
  const { customization, setCustomization, advancedOptions, setAdvancedOptions, step } = useDeployContestStore(
    state => state,
  );
  const [submissionsPerUserError, setSubmissionsPerUserError] = useState<string>("");
  const [maxSubmissionsError, setMaxSubmissionsError] = useState<string>("");
  const onNextStep = useNextStep([]);
  const disableNextStep = Boolean(submissionsPerUserError) || Boolean(maxSubmissionsError);

  useEffect(() => {
    validateMaxSubmissions(customization.maxSubmissions);
  }, [customization.maxSubmissions]);

  useEffect(() => {
    validateSubmissionsPerUser(customization.allowedSubmissionsPerUser);
  }, [customization.allowedSubmissionsPerUser]);

  const handleDownvoteChange = (value: boolean) => {
    setAdvancedOptions({
      ...advancedOptions,
      downvote: value,
    });
  };

  const handleContestVisibilityChange = (value: ContestVisibility) => {
    setAdvancedOptions({
      ...advancedOptions,
      contestVisibility: value,
    });
  };

  const onSubmissionsPerUserChange = (value: number | null) => {
    validateSubmissionsPerUser(value);
    if (value) setCustomization({ ...customization, allowedSubmissionsPerUser: value });
  };

  const onMaxSubmissionsChange = (value: number | null) => {
    validateMaxSubmissions(value);
    if (value) setCustomization({ ...customization, maxSubmissions: value });
  };

  const validateSubmissionsPerUser = (value: number | null) => {
    if (value === null || value < 1) {
      setSubmissionsPerUserError("must be at least 1");
    } else if (value > MAX_SUBMISSIONS_LIMIT) {
      setSubmissionsPerUserError(`must be less than ${MAX_SUBMISSIONS_LIMIT}`);
    } else {
      setSubmissionsPerUserError("");
    }
  };

  const validateMaxSubmissions = (value: number | null) => {
    if (value === null || value < 1) {
      setMaxSubmissionsError("must be at least 1");
    } else if (value > MAX_SUBMISSIONS_LIMIT) {
      setMaxSubmissionsError(`must be less than ${MAX_SUBMISSIONS_LIMIT}`);
    } else {
      setMaxSubmissionsError("");
    }
  };

  return (
    <div className="flex flex-col gap-12 mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="flex flex-col md:flex-row gap-10">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-12">
          <p className="text-[24px] text-primary-10 font-bold">finally, we do a little customizing</p>
          <div className="flex flex-col gap-8">
            <ContestParamsSubmissionsPerPlayer
              allowedSubmissionsPerUser={customization.allowedSubmissionsPerUser}
              submissionsPerUserError={submissionsPerUserError}
              onSubmissionsPerUserChange={onSubmissionsPerUserChange}
            />
            <ContestParamsSubmissionsPerContest
              maxSubmissions={customization.maxSubmissions}
              submissionsPerContestError={maxSubmissionsError}
              onMaxSubmissionsChange={onMaxSubmissionsChange}
            />

            <ContestParamsDownvote downvote={advancedOptions.downvote} onChange={handleDownvoteChange} />

            <ContestParamsVisibility
              contestVisibility={advancedOptions.contestVisibility}
              onChange={handleContestVisibilityChange}
            />
          </div>

          <div className="mt-4">
            <CreateNextButton step={step} onClick={onNextStep} isDisabled={disableNextStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestParams;
