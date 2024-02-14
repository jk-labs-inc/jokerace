import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import CreateDefaultDropdown from "@components/_pages/Create/components/DefaultDropdown";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { useState } from "react";
import {
  TimingPeriod,
  addTimeBasedOnPeriod,
  timingPeriodsOptions,
  useTimingOptionForSubmissionPeriod,
  useTimingOptionForVotingPeriod,
} from "../../utils";

const CreateSubmissionPeriod = () => {
  const { submissionOpen, setSubmissionOpen, votingOpen, setVotingOpen, setVotingClose, errors, step } =
    useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const currentVotesOpenError = currentStepError?.message.startsWith("Voting open") ? currentStepError.message : "";
  const { timingOption: submissionPeriodTimingOption, setTimingOption: setSubmissionPeriodTimingOption } =
    useTimingOptionForSubmissionPeriod(state => state);
  const { timingOption: votingPeriodTimingOption, setTimingOption: setVotingPeriodTimingOption } =
    useTimingOptionForVotingPeriod(state => state);
  const [hideDatePickers, setHideDatePickers] = useState<boolean>(false);

  const onSubmissionDateChange = (value: Date) => {
    setSubmissionOpen(value);
    setSubmissionPeriodTimingOption({
      label: "custom",
      value: "custom",
    });
  };

  const onVotesOpenChange = (value: Date) => {
    setVotingOpen(value);
    setSubmissionPeriodTimingOption({
      label: "custom",
      value: "custom",
    });
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
    setVotingOpen(votingOpenDate);

    if (votingPeriodTimingOption.value !== TimingPeriod.Custom) {
      const votingCloseDate = addTimeBasedOnPeriod(votingOpenDate, votingPeriodTimingOption.value as TimingPeriod);
      setVotingClose(votingCloseDate);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11 uppercase">submission period</p>
        <CreateDefaultDropdown
          options={timingPeriodsOptions}
          defaultOption={submissionPeriodTimingOption}
          className="w-[216px]"
          onChange={option => onTimingPeriodChange(option)}
          onMenuStateChange={state => setHideDatePickers(state)}
        />
      </div>
      <div
        className={`flex flex-col gap-8 border-l border-neutral-11 pl-6 ${
          hideDatePickers ? "opacity-20" : "opacity-100"
        }`}
      >
        <div className="flex flex-col gap-4">
          <p className="text-[16px] font-bold text-neutral-11 uppercase">opens</p>
          <CreateDatePicker onChange={onSubmissionDateChange} defaultDate={submissionOpen} minDate={new Date()} />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-[16px] font-bold text-neutral-11 uppercase">closes</p>
          <CreateDatePicker
            onChange={onVotesOpenChange}
            defaultDate={votingOpen}
            minDate={votingOpen}
            error={currentVotesOpenError}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSubmissionPeriod;
