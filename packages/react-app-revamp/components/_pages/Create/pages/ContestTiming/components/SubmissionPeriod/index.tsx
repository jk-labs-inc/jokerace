import CreateDatePicker from "@components/_pages/Create/components/DatePicker";
import CreateDefaultDropdown, { Option } from "@components/_pages/Create/components/DefaultDropdown";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import moment from "moment";
import { useState } from "react";
import { TimingPeriod, timingPeriodsOptions, useTimingOptionForSubmissionPeriod } from "../../utils";

const CreateSubmissionPeriod = () => {
  const { submissionOpen, setSubmissionOpen, votingOpen, setVotingOpen, errors, step } = useDeployContestStore(
    state => state,
  );
  const currentStepError = errors.find(error => error.step === step);
  const currentVotesOpenError = currentStepError?.message.startsWith("Voting open") ? currentStepError.message : "";
  const { timingOption, setTimingOption } = useTimingOptionForSubmissionPeriod(state => state);
  const [hideDatePickers, setHideDatePickers] = useState<boolean>(false);

  const onSubmissionDateChange = (value: Date) => {
    setSubmissionOpen(value);
    setTimingOption({
      label: "custom",
      value: "custom",
    });
  };

  const onVotesOpenChange = (value: Date) => {
    setVotingOpen(value);
    setTimingOption({
      label: "custom",
      value: "custom",
    });
  };

  //TODO: manipulate voting closes when we change submission period
  const onTimingPeriodChange = (option: string) => {
    const now = new Date();
    setSubmissionOpen(now);
    setTimingOption({
      value: option,
      label: timingPeriodsOptions.find(opt => opt.value === option)?.label ?? "",
    });

    switch (option) {
      case TimingPeriod.OneWeek:
        setVotingOpen(moment(now).add(1, "weeks").toDate());
        break;
      case TimingPeriod.OneHour:
        setVotingOpen(moment(now).add(1, "hours").toDate());
        break;
      case TimingPeriod.OneDay:
        setVotingOpen(moment(now).add(1, "days").toDate());
        break;
      case TimingPeriod.OneMonth:
        setVotingOpen(moment(now).add(1, "months").toDate());
        break;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <p className="text-[16px] font-bold text-neutral-11 uppercase">submission period</p>
        <CreateDefaultDropdown
          options={timingPeriodsOptions}
          defaultOption={timingOption}
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
