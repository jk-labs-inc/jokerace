import moment from "moment";
import PeriodSelector from "../PeriodSelector";
import CreateContestTimingHourSelector from "../Selectors/HourSelector";
import CreateContestTimingMonthSelector from "../Selectors/MonthSelector";
import CreateContestTimingDaySelector from "../Selectors/DaySelector";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Period } from "@hooks/useDeployContest/slices/contestTimingSlice";
import { useShallow } from "zustand/shallow";

const CreateContestTimingVotingCloses = () => {
  const {
    votingClose,
    updateVotingClose,
    getVotingCloseMonthOptions,
    getVotingCloseDayOptions,
    getVotingCloseHourOptions,
  } = useDeployContestStore(
    useShallow(state => ({
      votingClose: state.votingClose,
      updateVotingClose: state.updateVotingClose,
      getVotingCloseMonthOptions: state.getVotingCloseMonthOptions,
      getVotingCloseDayOptions: state.getVotingCloseDayOptions,
      getVotingCloseHourOptions: state.getVotingCloseHourOptions,
    })),
  );

  const monthOptions = getVotingCloseMonthOptions();
  const dayOptions = getVotingCloseDayOptions();
  const hourOptions = getVotingCloseHourOptions();

  const monthLabel = moment().month(votingClose.month).format("MMMM");
  const hourLabel = `${votingClose.hour}:00`;

  const handleMonthChange = (monthValue: string) => {
    updateVotingClose({ month: parseInt(monthValue) });
  };

  const handleDayChange = (dayValue: string) => {
    updateVotingClose({ day: parseInt(dayValue) });
  };

  const handleHourChange = (hourValue: string) => {
    updateVotingClose({ hour: parseInt(hourValue) });
  };

  const handlePeriodChange = (period: Period) => {
    updateVotingClose({ period });
  };

  return (
    <div className="flex flex-col gap-4 pl-6">
      <p className="text-base font-bold text-neutral-9 uppercase">voting closes</p>
      <div className="flex items-center gap-4">
        <CreateContestTimingMonthSelector
          months={monthOptions}
          defaultValue={monthLabel}
          onChange={handleMonthChange}
        />
        <CreateContestTimingDaySelector
          days={dayOptions}
          defaultValue={votingClose.day.toString()}
          onChange={handleDayChange}
        />
        <CreateContestTimingHourSelector hours={hourOptions} defaultValue={hourLabel} onChange={handleHourChange} />
        <PeriodSelector value={votingClose.period} onChange={handlePeriodChange} layoutId="voting-close-period" />
      </div>
    </div>
  );
};

export default CreateContestTimingVotingCloses;
