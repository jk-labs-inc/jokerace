import { Period } from "@hooks/useDeployContest/slices/contestTimingSlice";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import moment from "moment";
import { useShallow } from "zustand/shallow";
import PeriodSelector from "../PeriodSelector";
import CreateContestTimingDaySelector from "../Selectors/DaySelector";
import CreateContestTimingHourSelector from "../Selectors/HourSelector";
import CreateContestTimingMonthSelector from "../Selectors/MonthSelector";

const CreateContestTimingVotingOpens = () => {
  const { votingOpen, updateVotingOpen, getVotingOpenMonthOptions, getVotingOpenDayOptions, getVotingOpenHourOptions } =
    useDeployContestStore(
      useShallow(state => ({
        votingOpen: state.votingOpen,
        updateVotingOpen: state.updateVotingOpen,
        getVotingOpenMonthOptions: state.getVotingOpenMonthOptions,
        getVotingOpenDayOptions: state.getVotingOpenDayOptions,
        getVotingOpenHourOptions: state.getVotingOpenHourOptions,
      })),
    );

  const monthOptions = getVotingOpenMonthOptions();
  const dayOptions = getVotingOpenDayOptions();
  const hourOptions = getVotingOpenHourOptions();

  const monthLabel = moment().month(votingOpen.month).format("MMMM");
  const hourLabel = `${votingOpen.hour}:00`;

  const handleMonthChange = (monthValue: string) => {
    updateVotingOpen({ month: parseInt(monthValue) });
  };

  const handleDayChange = (dayValue: string) => {
    updateVotingOpen({ day: parseInt(dayValue) });
  };

  const handleHourChange = (hourValue: string) => {
    updateVotingOpen({ hour: parseInt(hourValue) });
  };

  const handlePeriodChange = (period: Period) => {
    updateVotingOpen({ period });
  };

  return (
    <div className="flex flex-col gap-4 pl-6">
      <p className="text-base font-bold text-neutral-9 uppercase">voting opens</p>
      <div className="grid grid-cols-2 items-center gap-4 md:flex">
        <CreateContestTimingMonthSelector
          months={monthOptions}
          defaultValue={monthLabel}
          onChange={handleMonthChange}
        />
        <CreateContestTimingDaySelector
          days={dayOptions}
          defaultValue={votingOpen.day.toString()}
          onChange={handleDayChange}
        />
        <CreateContestTimingHourSelector hours={hourOptions} defaultValue={hourLabel} onChange={handleHourChange} />
        <PeriodSelector value={votingOpen.period} onChange={handlePeriodChange} layoutId="voting-open-period" />
      </div>
    </div>
  );
};

export default CreateContestTimingVotingOpens;
