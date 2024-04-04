import getContestContractVersion from "@helpers/getContestContractVersion";
import NewContest from "./new";

export const metadata = {
  title: "Create a new contest - jokerace",
};

const Page = async () => {
  return <NewContest />;
};

export default Page;
