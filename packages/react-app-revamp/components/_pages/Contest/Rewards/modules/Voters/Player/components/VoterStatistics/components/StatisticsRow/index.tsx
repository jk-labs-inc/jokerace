import { FC, ReactNode } from "react";

interface StatisticsRowProps {
  label: ReactNode;
  value: ReactNode;
  isLast?: boolean;
  bold?: boolean;
}

const StatisticsRow: FC<StatisticsRowProps> = ({ label, value, isLast = false, bold = false }) => {
  const rowClasses = `
    flex justify-between items-center 
    text-[16px] 
    ${bold ? "font-bold text-neutral-11" : "font-normal"} 
    ${!isLast ? "border-b border-primary-2 pb-2" : ""}
  `;

  return (
    <div className={rowClasses}>
      <span>{label}</span>
      <div className={bold ? "font-bold" : ""}>{value}</div>
    </div>
  );
};

export default StatisticsRow;
