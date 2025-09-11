import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import moment from "moment";
import { usePathname } from "next/navigation";
import ContestParametersEarnings from "./components/Earnings";
import ContestParametersRewards from "./components/Rewards";
import ContestParametersSubmissions from "./components/Submissions";
import ContestParametersTimeline from "./components/Timeline";
import ContestParametersVoting from "./components/Voting";

const ContestParameters = () => {
  const { submissionsOpen, votesClose, votesOpen, contestAuthor, charge, version } = useContestStore(state => state);
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const blockExplorerUrl = chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.blockExplorers
    ?.default.url;
  const formattedSubmissionsOpen = moment(submissionsOpen).format("MMMM Do, h:mm a");
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");
  const formattedVotesClosing = moment(votesClose).format("MMMM Do, h:mm a");

  return (
    <div className="flex flex-col gap-12 animate-reveal">
      <ContestParametersTimeline
        submissionsOpen={formattedSubmissionsOpen}
        votesOpen={formattedVotesOpen}
        votesClose={formattedVotesClosing}
      />
      <div className="flex flex-col gap-8">
        {version && <ContestParametersRewards version={version} charge={charge} />}
        <ContestParametersSubmissions />
        <ContestParametersVoting />
        <ContestParametersEarnings charge={charge} contestAuthor={contestAuthor} blockExplorerUrl={blockExplorerUrl} />
      </div>
    </div>
  );
};

export default ContestParameters;
