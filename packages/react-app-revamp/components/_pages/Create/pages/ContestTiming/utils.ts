import moment from "moment-timezone";
import { MONTH_NAMES } from "./constants";

export interface DropdownOption {
  label: string;
  value: string;
}

/**
 * Convert 12-hour format to 24-hour format
 */
export const convertTo24Hour = (hour: number, period: "AM" | "PM"): number => {
  if (period === "AM") {
    return hour === 12 ? 0 : hour;
  }
  return hour === 12 ? 12 : hour + 12;
};

/**
 * Convert 24-hour format to 12-hour format
 */
export const convertTo12Hour = (hour: number): { hour: number; period: "AM" | "PM" } => {
  if (hour === 0) return { hour: 12, period: "AM" };
  if (hour < 12) return { hour, period: "AM" };
  if (hour === 12) return { hour: 12, period: "PM" };
  return { hour: hour - 12, period: "PM" };
};

/**
 * Create a date from selections in local timezone
 */
export const createDateFromSelections = (month: number, day: number, hour12: number, period: "AM" | "PM"): Date => {
  const now = moment();
  const year = month < now.month() ? now.year() + 1 : now.year();
  const hour24 = convertTo24Hour(hour12, period);

  return moment().year(year).month(month).date(day).hour(hour24).minute(0).second(0).millisecond(0).toDate();
};

/**
 * Get available months from now up to 1 month ahead
 */
export const getAvailableMonths = (): DropdownOption[] => {
  const now = moment();
  const oneMonthAhead = moment().add(1, "month");

  const months: DropdownOption[] = [
    {
      label: MONTH_NAMES[now.month()],
      value: String(now.month()),
    },
  ];

  if (now.month() !== oneMonthAhead.month()) {
    months.push({
      label: MONTH_NAMES[oneMonthAhead.month()],
      value: String(oneMonthAhead.month()),
    });
  }

  return months;
};

/**
 * Get available days for a given month/year within the 1-month window
 */
export const getAvailableDays = (month: number, year: number): DropdownOption[] => {
  const now = moment();
  const oneMonthAhead = moment().add(1, "month");
  const daysInMonth = moment().month(month).year(year).daysInMonth();

  const days: DropdownOption[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = moment().year(year).month(month).date(day);

    if (date.isSameOrAfter(now, "day") && date.isSameOrBefore(oneMonthAhead, "day")) {
      days.push({ label: String(day), value: String(day) });
    }
  }

  return days;
};

/**
 * Get hours in 12-hour format (1-12)
 */
export const getAvailableHours = (): DropdownOption[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  }));
};
