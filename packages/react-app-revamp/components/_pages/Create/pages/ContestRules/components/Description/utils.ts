import { ContestType } from "@components/_pages/Create/types";
import { EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import { Charge } from "@hooks/useDeployContest/types";
import moment from "moment";

const SUMMARY_TEMPLATES = {
  [ContestType.AnyoneCanPlay]:
    "This is an open contest where anyone can submit an entry for [entry price] and vote by paying [voting price] per vote. Contestants should enter a [entry preview] representing their entry below, along with any relevant information about why voters should vote for them.\n\nContestants can enter between [entry open date] and [entry closing date], and voters can vote between [voting open date] and [voting closing date].",

  [ContestType.EntryContest]:
    'This contest is open for anyone to submit an entry for [entry price] and will be judged by an allowlisted jury of voters: you can find the allowlist on the "parameters" tab. Contestants should enter a [entry preview] representing their entry below, along with any relevant information about why voters should vote for them.\n\nContestants can enter between [entry open date] and [entry closing date], and voters can vote between [voting open date] and [voting closing date].',

  [ContestType.VotingContest]:
    "This contest is open for anyone to vote by paying [voting price] per vote. Pick your favorite entry—or entries!—and you can buy as many votes as you like.\n\nVote between [voting open date] and [voting closing date].",
};

const formatDate = (date: Date) =>
  date ? moment(date).format("MMMM D, YYYY h:mmA") + " " + moment.tz(moment.tz.guess()).zoneAbbr() : "";

const getEntryPreviewLabel = (entryPreview: EntryPreview): string => {
  switch (entryPreview) {
    case EntryPreview.TITLE:
      return "title";
    case EntryPreview.IMAGE:
      return "image";
    case EntryPreview.IMAGE_AND_TITLE:
      return "image and title";
    case EntryPreview.TWEET:
      return "tweet";
    default:
      return "entry";
  }
};

export const generateDynamicSummary = (
  type: ContestType,
  charge: Charge,
  submissionOpen: Date,
  votingOpen: Date,
  votingClose: Date,
  entryPreview: EntryPreview,
  nativeCurrency: string,
) => {
  const template = SUMMARY_TEMPLATES[type] || "";

  let result = template;

  const placeholders = {
    "[entry price]": charge.type.costToPropose + " " + nativeCurrency,
    "[voting price]": charge.type.costToVote + " " + nativeCurrency,
    "[entry open date]": formatDate(submissionOpen),
    "[entry closing date]": formatDate(votingOpen),
    "[voting open date]": formatDate(votingOpen),
    "[voting closing date]": formatDate(votingClose),
    "[entry preview]": getEntryPreviewLabel(entryPreview),
  };

  for (const [placeholder, value] of Object.entries(placeholders)) {
    result = result.split(placeholder).join(String(value));
  }

  return result;
};
