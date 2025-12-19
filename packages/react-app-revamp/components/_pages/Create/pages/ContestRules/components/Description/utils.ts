import { EntryPermission, EntryPreview } from "@hooks/useDeployContest/slices/contestMetadataSlice";
import { Charge, PriceCurve } from "@hooks/useDeployContest/types";
import moment from "moment";

const SUMMARY_TEMPLATES = {
  [EntryPermission.ANYONE_CAN_SUBMIT]:
    "This is an open contest where anyone can submit an entry. Contestants should enter a [entry preview] representing their entry below, along with any relevant information about why voters should vote for them.\n\nContestants can enter between [entry open date] and [entry closing date].\n\nVotes start at [voting start price] at [voting open date] and end at [voting end price] at [voting closing date].",

  [EntryPermission.ONLY_CREATOR]:
    "This contest is open for anyone to vote. Pick your favorite entry—or entries!—and you can buy as many votes as you like.\n\nVotes start at [voting start price] at [voting open date] and end at [voting end price] at [voting closing date].",
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
  charge: Charge,
  priceCurve: PriceCurve,
  submissionOpen: Date,
  votingOpen: Date,
  votingClose: Date,
  entryPreview: EntryPreview,
  nativeCurrency: string,
  isAnyoneCanSubmit: EntryPermission,
) => {
  let result = SUMMARY_TEMPLATES[isAnyoneCanSubmit];

  const placeholders = {
    "[voting start price]": charge.costToVote + " " + nativeCurrency,
    "[voting end price]": charge.costToVoteEndPrice + " " + nativeCurrency,
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
