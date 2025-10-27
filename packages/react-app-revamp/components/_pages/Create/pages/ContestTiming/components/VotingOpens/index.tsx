import PeriodSelector, { Period } from "../PeriodSelector";
import CreateContestTimingDaySelector from "../Selectors/DaySelector";
import CreateContestTimingHourSelector from "../Selectors/HourSelector";
import CreateContestTimingMonthSelector from "../Selectors/MonthSelector";

const months = [
  { label: "January", value: "january" },
  { label: "February", value: "february" },
  { label: "March", value: "march" },
  { label: "April", value: "april" },
  { label: "May", value: "may" },
  { label: "June", value: "june" },
];

const days = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

const hours = [
  { label: "11:00", value: "11:00" },
  { label: "12:00", value: "12:00" },
  { label: "13:00", value: "13:00" },
  { label: "14:00", value: "14:00" },
  { label: "15:00", value: "15:00" },
];

const CreateContestTimingVotingOpens = () => {
  return (
    <div className="flex flex-col gap-4 pl-6">
      <p className="text-base font-bold text-neutral-9 uppercase">voting opens</p>
      <div className="flex items-center gap-4">
        <CreateContestTimingMonthSelector months={months} defaultValue={months[0].value} />
        <CreateContestTimingDaySelector days={days} defaultValue={days[0].value} />
        <CreateContestTimingHourSelector hours={hours} defaultValue={hours[0].value} />
        <PeriodSelector value={Period.AM} onChange={() => {}} />
      </div>
    </div>
  );
};

export default CreateContestTimingVotingOpens;
