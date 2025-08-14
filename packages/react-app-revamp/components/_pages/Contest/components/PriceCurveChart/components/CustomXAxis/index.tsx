import moment from "moment";
import { FC } from "react";

interface PriceCurveChartCustomXAxisProps {
  firstDate: string;
  activeDate: string;
  lastDate: string;
}

const formatDateWithBoldMonthDay = (dateString: string) => {
  const momentDate = moment(dateString);
  const monthDay = momentDate.format("MMMM D").toLowerCase();
  const time = momentDate.format("h:mm a").toLowerCase();

  return (
    <>
      <b>{monthDay}</b>, {time}
    </>
  );
};

const PriceCurveChartCustomXAxis: FC<PriceCurveChartCustomXAxisProps> = ({ firstDate, activeDate, lastDate }) => {
  return (
    <div className="flex justify-between items-center w-full py-2 text-white text-[12px]">
      <div className="text-left">{formatDateWithBoldMonthDay(firstDate)}</div>
      <div className="text-center bg-neutral-0 px-3 py-1 rounded-lg">{formatDateWithBoldMonthDay(activeDate)}</div>
      <div className="text-right text-neutral-11">{formatDateWithBoldMonthDay(lastDate)}</div>
    </div>
  );
};

export default PriceCurveChartCustomXAxis;
