import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import { useContestStore } from "@hooks/useContest/store";
import { EMPTY_ROOT } from "@hooks/useUser";
import { useUserStore } from "@hooks/useUser/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import ContestParametersEarnings from "./components/Earnings";
import ContestParametersSubmissions from "./components/Submissions";
import ContestParametersTimeline from "./components/Timeline";
import ContestParametersVoting from "./components/Voting";

const UNLIMITED_PROPOSALS_PER_USER = 1000000;

const ContestParameters = () => {
  const {
    submissionsOpen,
    votesClose,
    votesOpen,
    contestMaxProposalCount,
    votingRequirements,
    submissionMerkleRoot,
    contestAuthor,
    votingMerkleRoot,
    anyoneCanVote,
    charge,
  } = useContestStore(state => state);
  const asPath = usePathname();
  const { chainName } = extractPathSegments(asPath ?? "");
  const nativeCurrency = chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.nativeCurrency;
  const blockExplorerUrl = chains.find(chain => chain.name.toLowerCase() === chainName.toLowerCase())?.blockExplorers
    ?.default.url;
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const {
    contestMaxNumberSubmissionsPerUser,
    currentUserQualifiedToSubmit,
    currentUserAvailableVotesAmount,
    currentUserTotalVotesAmount,
  } = useUserStore(state => state);
  const formattedSubmissionsOpen = moment(submissionsOpen).format("MMMM Do, h:mm a");
  const formattedVotesOpen = moment(votesOpen).format("MMMM Do, h:mm a");
  const formattedVotesClosing = moment(votesClose).format("MMMM Do, h:mm a");
  const maxProposalsPerUserCapped = contestMaxNumberSubmissionsPerUser == UNLIMITED_PROPOSALS_PER_USER;
  const anyoneCanSubmit = submissionMerkleRoot === EMPTY_ROOT;

  return (
    <div className="flex flex-col gap-16 animate-reveal">
      <ContestParametersTimeline
        submissionsOpen={formattedSubmissionsOpen}
        votesOpen={formattedVotesOpen}
        votesClose={formattedVotesClosing}
      />
      <ContestParametersSubmissions
        anyoneCanSubmit={anyoneCanSubmit}
        currentUserQualifiedToSubmit={currentUserQualifiedToSubmit}
        contestMaxNumberSubmissionsPerUser={contestMaxNumberSubmissionsPerUser}
        contestMaxProposalCount={contestMaxProposalCount}
        maxProposalsPerUserCapped={maxProposalsPerUserCapped}
        submissionMerkleRoot={submissionMerkleRoot}
        address={address ?? ""}
        costToPropose={charge?.type.costToPropose}
        nativeCurrencySymbol={nativeCurrency?.symbol}
        openConnectModal={openConnectModal}
      />
      <ContestParametersVoting
        anyoneCanVote={anyoneCanVote}
        votingMerkleRoot={votingMerkleRoot}
        address={address ?? ""}
        currentUserAvailableVotesAmount={currentUserAvailableVotesAmount}
        currentUserTotalVotesAmount={currentUserTotalVotesAmount}
        voteCharge={charge && { type: charge.voteType, cost: charge.type.costToVote }}
        nativeCurrencySymbol={nativeCurrency?.symbol}
        votingRequirementsDescription={votingRequirements?.description}
        openConnectModal={openConnectModal}
      />
      {charge ? (
        <ContestParametersEarnings charge={charge} contestAuthor={contestAuthor} blockExplorerUrl={blockExplorerUrl} />
      ) : null}
    </div>
  );
};

export default ContestParameters;
