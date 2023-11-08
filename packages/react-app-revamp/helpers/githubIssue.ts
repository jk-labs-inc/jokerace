import { browserName, browserVersion } from "react-device-detect";

const getDeviceType = (userAgentData: any) => {
  const isMobile = userAgentData.mobile;
  const platform = userAgentData.platform;
  const brand = userAgentData.brands?.[0]?.brand;
  const version = userAgentData.brands?.[0]?.version;

  if (isMobile) {
    return `Mobile (${brand} ${version})`;
  } else {
    return `Desktop/Laptop (${platform})`;
  }
};

export const populateBugReportLink = (contestLink: string, walletAddress: string, errorDetails: string) => {
  //@ts-ignore
  const deviceDetails = getDeviceType(window.navigator.userAgentData);
  const browserInfo = `${browserName} ${browserVersion}` || "Unknown Browser";
  const bugReportLinkBase =
    "https://github.com/jk-labs-inc/jokerace/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D";

  return `${bugReportLinkBase}&body=Contest+Link%3A+${encodeURIComponent(
    contestLink,
  )}%0A%0AYour+Wallet+Address%3A+${encodeURIComponent(
    walletAddress,
  )}%0A%0ADescription+-+Please+tap+%22copy+error+details%22+from+the+error+message+and+paste+it+here+if+you're+getting+an+error+message.+If+you+can%2C+please+include+a+screenshot+as+well%3A+${encodeURIComponent(
    errorDetails,
  )}%0A%0A---%0A%0AImportant+info%0A%0ADevice%3A+${encodeURIComponent(
    deviceDetails,
  )}%0AWallet%3A%0ABrowser%3A+${encodeURIComponent(
    browserInfo,
  )}%0ATelegram+Handle+%28so+we+can+reach+you+if+needed%29%3A+%0A%0A---%0A%0AHelp+us+solve+this+quickly+%28optional%29%0A%0AWrite+out+the+steps+for+how+you+got+from+opening+the+browser+to+this+error+appearing%3A%0A%0A1.+%0A2.+%0A3.+%0A`;
};
