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
  const { submissionOpen, setSubmissionOpen, votingOpen, setVotingOpen, votingClose, setVotingClose, errors, step } =
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

    // only adjust votingOpen if the new submissionOpen is after the current votingOpen
    if (value > votingOpen) {
      // set voting open to 1 hour after the new voting open time
      const newVotingOpen = new Date(value.getTime() + 60 * 60 * 1000);
      setVotingOpen(newVotingOpen);

      if (votingPeriodTimingOption.value !== TimingPeriod.Custom) {
        const votingCloseDate = addTimeBasedOnPeriod(newVotingOpen, votingPeriodTimingOption.value as TimingPeriod);
        setVotingClose(votingCloseDate);
      }
    }
  };

  const onVotesOpenChange = (value: Date) => {
    if (value > submissionOpen) {
      setVotingOpen(value);
      setSubmissionPeriodTimingOption({
        label: "custom",
        value: "custom",
      });

      // check if the new voting open time is after the current voting close time
      if (value >= votingClose) {
        // Set voting close to 1 hour after the new voting open time
        const newVotingClose = new Date(value.getTime() + 60 * 60 * 1000);
        setVotingClose(newVotingClose);
        setVotingPeriodTimingOption({
          label: "custom",
          value: "custom",
        });
      }
    } else {
      const newVotingOpen = new Date(submissionOpen.getTime() + 60000);
      setVotingOpen(newVotingOpen);

      // check if the adjusted voting open time is after the current voting close time
      if (newVotingOpen >= votingClose) {
        // set voting close to 1 hour after the new voting open time
        const newVotingClose = new Date(newVotingOpen.getTime() + 60 * 60 * 1000);
        setVotingClose(newVotingClose);
        setVotingPeriodTimingOption({
          label: "custom",
          value: "custom",
        });
      }
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
          className="w-48 md:w-[216px]"
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
            minDate={submissionOpen}
            error={currentVotesOpenError}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSubmissionPeriod;
