import { MAX_SUBMISSIONS_LIMIT, useDeployContest } from "@hooks/useDeployContest";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useEffect, useState } from "react";
import CreateContestButton from "../../components/Buttons/Submit";
import StepCircle from "../../components/StepCircle";
import ContestParamsDownvote from "./components/Downvote";
import ContestParamsSubmissionsPerContest from "./components/SubmissionsPerContest";
import ContestParamsSubmissionsPerPlayer from "./components/SubmissionsPerPlayer";

const CreateContestParams = () => {
  const { deployContest } = useDeployContest();
  const {
    setMaxSubmissions,
    setAllowedSubmissionsPerUser,
    allowedSubmissionsPerUser,
    maxSubmissions,
    advancedOptions,
    setAdvancedOptions,
    step,
  } = useDeployContestStore(state => state);
  const [submissionsPerUserError, setSubmissionsPerUserError] = useState<string>("");
  const [maxSubmissionsError, setMaxSubmissionsError] = useState<string>("");
  const disableDeploy = Boolean(submissionsPerUserError) || Boolean(maxSubmissionsError);

  useEffect(() => {
    validateMaxSubmissions(maxSubmissions);
  }, [maxSubmissions]);

  useEffect(() => {
    validateSubmissionsPerUser(allowedSubmissionsPerUser);
  }, [allowedSubmissionsPerUser]);

  const handleDownvoteChange = async (value: boolean) => {
    setAdvancedOptions({
      ...advancedOptions,
      downvote: value,
    });
  };

  const onSubmissionsPerUserChange = (value: number | null) => {
    validateSubmissionsPerUser(value);
    if (value) setAllowedSubmissionsPerUser(value);
  };

  const onMaxSubmissionsChange = (value: number | null) => {
    validateMaxSubmissions(value);
    if (value) setMaxSubmissions(value);
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

  const handleDeployContest = async () => {
    deployContest();
  };

  return (
    <div className="flex flex-col gap-12 mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="flex flex-col md:flex-row gap-5">
        <StepCircle step={step + 1} />
        <ContestParamsSubmissionsPerPlayer
          allowedSubmissionsPerUser={allowedSubmissionsPerUser}
          submissionsPerUserError={submissionsPerUserError}
          onSubmissionsPerUserChange={onSubmissionsPerUserChange}
        />
      </div>
      <div className="md:ml-[70px] flex flex-col gap-12">
        <ContestParamsSubmissionsPerContest
          maxSubmissions={maxSubmissions}
          submissionsPerContestError={maxSubmissionsError}
          onMaxSubmissionsChange={onMaxSubmissionsChange}
        />

        <ContestParamsDownvote downvote={advancedOptions.downvote} onChange={handleDownvoteChange} />

        <div>
          <p className="text-[24px] text-neutral-11">
            that’s it! now let’s create this contest—and then you can add rewards
          </p>
        </div>
        <div>
          <CreateContestButton step={step} onClick={handleDeployContest} isDisabled={disableDeploy} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestParams;
