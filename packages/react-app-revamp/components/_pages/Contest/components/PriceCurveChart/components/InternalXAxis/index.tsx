import React from "react";
import moment from "moment";

interface InternalXAxisProps {
  firstDate: string;
  activeDate: string;
  lastDate: string;
  innerWidth: number;
  yPosition: number;
  activeDateXPosition: number;
}

const formatDateWithBoldMonthDay = (dateString: string) => {
  const momentDate = moment(dateString);
  const monthDay = momentDate.format("MMMM D").toLowerCase();
  const time = momentDate.format("h:mm a").toLowerCase();

  return { monthDay, time };
};

const InternalXAxis: React.FC<InternalXAxisProps> = ({
  firstDate,
  activeDate,
  lastDate,
  innerWidth,
  yPosition,
  activeDateXPosition,
}) => {
  const firstDateFormatted = formatDateWithBoldMonthDay(firstDate);
  const activeDateFormatted = formatDateWithBoldMonthDay(activeDate);
  const lastDateFormatted = formatDateWithBoldMonthDay(lastDate);

  // Calculate boundaries for smart hiding
  const rectWidth = 130;
  const threshold = 150; // Distance threshold for hiding static dates

  // Determine which static dates to show based on active date position
  const isNearLeft = activeDateXPosition < threshold;
  const isNearRight = activeDateXPosition > innerWidth - threshold;

  const shouldShowLeft = !isNearLeft;
  const shouldShowRight = !isNearRight;

  return (
    <g>
      {/* Left date - hide when center card is too close */}
      {shouldShowLeft && (
        <text y={yPosition} fill="#ffffff" fontSize="12" textAnchor="start">
          <tspan fontWeight="bold">{firstDateFormatted.monthDay}</tspan>
          <tspan fontWeight="normal">, {firstDateFormatted.time}</tspan>
        </text>
      )}

      <g>
        <rect
          x={activeDateXPosition - rectWidth / 2}
          y={yPosition - 15}
          width={rectWidth}
          height={24}
          rx={8}
          fill="#ffffff"
          opacity={0.1}
        />
        <text
          x={activeDateXPosition}
          y={yPosition}
          fill="#ffffff"
          fontSize="12"
          textAnchor="middle"
          dominantBaseline="baseline"
        >
          <tspan fontWeight="bold">{activeDateFormatted.monthDay}</tspan>
          <tspan fontWeight="normal">, {activeDateFormatted.time}</tspan>
        </text>
      </g>

      {/* Right date - hide when center card is too close */}
      {shouldShowRight && (
        <text x={innerWidth} y={yPosition} fill="#ffffff" fontSize="12" textAnchor="end">
          <tspan fontWeight="bold">{lastDateFormatted.monthDay}</tspan>
          <tspan fontWeight="normal">, {lastDateFormatted.time}</tspan>
        </text>
      )}
    </g>
  );
};

export default InternalXAxis;
