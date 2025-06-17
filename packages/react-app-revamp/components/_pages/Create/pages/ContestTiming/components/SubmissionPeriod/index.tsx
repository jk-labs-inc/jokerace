import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import CreateDefaultDropdown from "@components/_pages/Create/components/DefaultDropdown";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import {
  TimingPeriod,
  addTimeBasedOnPeriod,
  timingPeriodsOptions,
  useTimingOptionForSubmissionPeriod,
  useTimingOptionForVotingPeriod,
} from "../../utils";

const CreateSubmissionPeriod = () => {
  const { submissionOpen, setSubmissionOpen, votingOpen, setVotingOpen, votingClose, setVotingClose, errors, step } =
    useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const currentVotesOpenError = currentStepError?.message.startsWith("Voting open") ? currentStepError.message : "";
  const { timingOption: submissionPeriodTimingOption, setTimingOption: setSubmissionPeriodTimingOption } =
    useTimingOptionForSubmissionPeriod(state => state);
  const { timingOption: votingPeriodTimingOption, setTimingOption: setVotingPeriodTimingOption } =
    useTimingOptionForVotingPeriod(state => state);
  const isRecommendedTime = Math.abs(submissionOpen.getTime() - new Date().getTime()) < 1000;
  const maxVotingOpenDate = new Date(submissionOpen.getTime() + 7 * 24 * 60 * 60 * 1000);

  const onSubmissionDateChange = (value: Date) => {
    setSubmissionOpen(value);
    setSubmissionPeriodTimingOption({
      label: "custom",
      value: "custom",
    });

    // calculate new max date for voting open
    const newMaxVotingOpenDate = new Date(value.getTime() + 7 * 24 * 60 * 60 * 1000);

    // only adjust votingOpen if the new submissionOpen is after the current votingOpen
    // or if current votingOpen exceeds the 7-day limit
    if (value > votingOpen || votingOpen > newMaxVotingOpenDate) {
      // set voting open to 1 hour after the new submission open time
      const newVotingOpen = new Date(value.getTime() + 60 * 60 * 1000);
      setVotingOpen(newVotingOpen);

      // update voting close based on timing period
      updateVotingCloseTime(newVotingOpen);
    }
  };

  const onVotesOpenChange = (value: Date) => {
    // check if the selected date exceeds 7 days from submission open
    const maxAllowedDate = new Date(submissionOpen.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (value > maxAllowedDate) {
      // if it exceeds 7 days, set it to the maximum allowed date
      setVotingOpen(maxAllowedDate);
      updateVotingCloseTime(maxAllowedDate);
      return;
    }

    if (value > submissionOpen) {
      setVotingOpen(value);
      setSubmissionPeriodTimingOption({
        label: "custom",
        value: "custom",
      });

      // update voting close based on timing period
      updateVotingCloseTime(value);
    } else {
      const newVotingOpen = new Date(submissionOpen.getTime() + 60000);
      setVotingOpen(newVotingOpen);

      // update voting close based on timing period
      updateVotingCloseTime(newVotingOpen);
    }
  };

  // helper function to consistently update voting close time
  const updateVotingCloseTime = (newVotingOpen: Date) => {
    if (votingPeriodTimingOption.value === TimingPeriod.Custom) {
      // if custom and new voting open is after current close, adjust close time
      if (newVotingOpen >= votingClose) {
        const newVotingClose = new Date(newVotingOpen.getTime() + 60 * 60 * 1000);
        setVotingClose(newVotingClose);
      }
    } else {
      // for non-custom periods, always calculate based on the timing option
      const votingCloseDate = addTimeBasedOnPeriod(newVotingOpen, votingPeriodTimingOption.value as TimingPeriod);
      setVotingClose(votingCloseDate);
    }
  };

  const onTimingPeriodChange = (option: string) => {
    const now = new Date();
    setSubmissionOpen(now);
    setSubmissionPeriodTimingOption({
      value: option,
      label: timingPeriodsOptions.find(opt => opt.value === option)?.label ?? "",
    });

    const timingOption = option as TimingPeriod;

    const votingOpenDate = addTimeBasedOnPeriod(now, timingOption);
    const maxAllowedVotingOpen = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // ensure voting open doesn't exceed 7 days from submission open
    const finalVotingOpenDate = votingOpenDate > maxAllowedVotingOpen ? maxAllowedVotingOpen : votingOpenDate;
    setVotingOpen(finalVotingOpenDate);

    if (votingPeriodTimingOption.value !== TimingPeriod.Custom) {
      const votingCloseDate = addTimeBasedOnPeriod(finalVotingOpenDate, votingPeriodTimingOption.value as TimingPeriod);
      setVotingClose(votingCloseDate);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11 uppercase">entry period</p>
        <CreateDefaultDropdown
          options={timingPeriodsOptions}
          defaultOption={submissionPeriodTimingOption}
          className="w-48 md:w-[216px]"
          onChange={option => onTimingPeriodChange(option)}
        />
      </div>
      <div className={`flex flex-col gap-8 border-l border-neutral-11 pl-6`}>
        <div className="flex flex-col gap-4">
          <p className="text-[16px] font-bold text-neutral-11 uppercase">
            opens <span className="font-normal">{isRecommendedTime ? "(recommended)" : ""}</span>
          </p>
          <CreateDatePicker onChange={onSubmissionDateChange} defaultDate={submissionOpen} minDate={new Date()} />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-[16px] font-bold text-neutral-11 uppercase">closes</p>
          <CreateDatePicker
            onChange={onVotesOpenChange}
            defaultDate={votingOpen}
            minDate={submissionOpen}
            maxDate={maxVotingOpenDate}
            error={currentVotesOpenError}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSubmissionPeriod;
