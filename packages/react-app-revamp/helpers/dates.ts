import moment from "moment";

/**
 * Format date using Moment.js
 * @param dateString - The date string to format
 * @returns The formatted date string (example: "March 13, 12:00 PM")
 */
export const formatDate = (dateString: string): string => {
  return moment(dateString).format("MMMM D, h:mm a").toLowerCase();
};
