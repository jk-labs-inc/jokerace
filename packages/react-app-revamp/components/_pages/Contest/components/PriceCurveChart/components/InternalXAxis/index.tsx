import React from "react";
import moment from "moment";

interface InternalXAxisProps {
  firstDate: string;
  activeDate: string;
  lastDate: string;
  innerWidth: number;
  yPosition: number;
}

const formatDateWithBoldMonthDay = (dateString: string) => {
  const momentDate = moment(dateString);
  const monthDay = momentDate.format("MMMM D").toLowerCase();
  const time = momentDate.format("h:mm a").toLowerCase();

  return { monthDay, time };
};

const InternalXAxis: React.FC<InternalXAxisProps> = ({ firstDate, activeDate, lastDate, innerWidth, yPosition }) => {
  const firstDateFormatted = formatDateWithBoldMonthDay(firstDate);
  const activeDateFormatted = formatDateWithBoldMonthDay(activeDate);
  const lastDateFormatted = formatDateWithBoldMonthDay(lastDate);

  return (
    <g>
      {/* Left date - white text, same as original */}
      <text x={10} y={yPosition} fill="#ffffff" fontSize="12" textAnchor="start">
        <tspan fontWeight="bold">{firstDateFormatted.monthDay}</tspan>
        <tspan fontWeight="normal">, {firstDateFormatted.time}</tspan>
      </text>
      {/* Center date with background - matching bg-neutral-0 style */}
      <g>
        {/* Background rectangle matching the original rounded style */}
        <rect x={innerWidth / 2 - 65} y={yPosition - 12} width={130} height={18} rx={6} fill="#ffffff" opacity={0.1} />
        <text x={innerWidth / 2} y={yPosition + 1} fill="#ffffff" fontSize="12" textAnchor="middle">
          <tspan fontWeight="bold">{activeDateFormatted.monthDay}</tspan>
          <tspan fontWeight="normal">, {activeDateFormatted.time}</tspan>
        </text>
      </g>

      {/* Right date - matching text-neutral-11 color */}
      <text x={innerWidth - 10} y={yPosition} fill="#6b7280" fontSize="12" textAnchor="end">
        <tspan fontWeight="bold">{lastDateFormatted.monthDay}</tspan>
        <tspan fontWeight="normal">, {lastDateFormatted.time}</tspan>
      </text>
    </g>
  );
};

export default InternalXAxis;
