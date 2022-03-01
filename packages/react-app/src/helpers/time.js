export function convertToUnixTimeStamp(dateObject) {
  return Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(),
    dateObject.getUTCHours(), dateObject.getUTCMinutes(), dateObject.getUTCSeconds());
}