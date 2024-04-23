import { toastError } from "@components/UI/Toast";
import { MAX_SUBMISSIONS_LIMIT } from "@hooks/useDeployContest";
import { ContestVisibility, useDeployContestStore } from "@hooks/useDeployContest/store";
import { fetchChargeDetails } from "lib/monetization";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useAccount } from "wagmi";
import { steps } from "../..";
import CreateNextButton from "../../components/Buttons/Next";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";
import ContestParamsVisibility from "./components/ContestVisibility";
import ContestParamsDownvote from "./components/Downvote";
import ContestParamsSubmissionsPerContest from "./components/SubmissionsPerContest";
import ContestParamsSubmissionsPerPlayer from "./components/SubmissionsPerPlayer";

export const VOTING_STEP = 6;

const CreateContestParams = () => {
  const { chain } = useAccount();
  const {
    customization,
    setCustomization,
    advancedOptions,
    setAdvancedOptions,
    step,
    mobileStepTitle,
    resetMobileStepTitle,
    setStep,
  } = useDeployContestStore(state => state);
  const [submissionsPerUserError, setSubmissionsPerUserError] = useState<string>("");
  const [maxSubmissionsError, setMaxSubmissionsError] = useState<string>("");
  const validationFn = validationFunctions.get(step);
  const onNextStep = useNextStep([() => validationFn?.[0].validation(customization)]);
  const disableNextStep = Boolean(submissionsPerUserError) || Boolean(maxSubmissionsError);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const customizeTitle = isMobile ? "finally, we customize" : "finally, we do a little customizing";

  const handleNextStepMobile = useCallback(() => {
    if (!mobileStepTitle) return;

    if (mobileStepTitle === steps[step].title) {
      onNextStep();
      resetMobileStepTitle();
    }
  }, [mobileStepTitle, onNextStep, resetMobileStepTitle, step]);

  useEffect(() => {
    if (!chain) return;

    const fetchDetails = async () => {
      try {
        const { isError, minCostToPropose, minCostToVote } = await fetchChargeDetails(chain.name.toLowerCase());

        if (isError || !minCostToPropose || !minCostToVote) {
          toastError(`${chain.name} chain is not supported for anyone to vote.`);
          setStep(VOTING_STEP);
        }
      } catch (error) {
        toastError(`${chain.name} chain is not supported for anyone to vote.`);
        setStep(VOTING_STEP);
      }
    };

    fetchDetails();
  }, [chain, setStep]);

  // Mobile listeners
  useEffect(() => {
    handleNextStepMobile();
  }, [handleNextStepMobile]);

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
    <div className="full-width-create-flow-grid mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="col-span-1">
        <StepCircle step={step + 1} />
      </div>
      <div className="col-span-2 ml-10">
        <p className="text-[24px] text-primary-10 font-bold">{customizeTitle}</p>
      </div>
      <div className="grid gap-16 col-start-1 md:col-start-2 col-span-2 md:ml-10 mt-8 md:mt-12">
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

        <CreateNextButton step={step} onClick={onNextStep} isDisabled={disableNextStep} />
      </div>
    </div>
  );
};

export default CreateContestParams;
