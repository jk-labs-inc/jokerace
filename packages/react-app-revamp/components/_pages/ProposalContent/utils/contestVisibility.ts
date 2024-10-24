import { loadFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from "@helpers/localStorage";

export const HIDDEN_PROPOSALS_STORAGE_KEY = "hiddenProposalsPerContest";
export const BROWSER_SESSION_CHECK_KEY = "browserSessionCheck";

export interface ContestVisibilities {
  [contestId: string]: string[];
}

export const toggleContentVisibility = (
  contestAddress: string,
  proposalId: string,
  isContentHidden: boolean,
): boolean => {
  const newVisibility = !isContentHidden;
  const visibilityState = loadFromLocalStorage<ContestVisibilities>(HIDDEN_PROPOSALS_STORAGE_KEY, {});

  updateVisibilityState(visibilityState, contestAddress, proposalId, newVisibility);
  saveToLocalStorage(HIDDEN_PROPOSALS_STORAGE_KEY, visibilityState);

  return newVisibility;
};

const updateVisibilityState = (
  visibilityState: ContestVisibilities,
  contestAddress: string,
  proposalId: string,
  newVisibility: boolean,
): void => {
  let hiddenProposals = visibilityState[contestAddress] || [];

  if (newVisibility) {
    // add proposal id to hidden list if not already there
    if (!hiddenProposals.includes(proposalId)) {
      hiddenProposals = [...hiddenProposals, proposalId];
    }
  } else {
    // remove proposal id from hidden list
    hiddenProposals = hiddenProposals.filter(id => id !== proposalId);
  }

  if (hiddenProposals.length > 0) {
    visibilityState[contestAddress] = hiddenProposals;
  } else {
    // if there are no hidden proposals, remove the contest from the visibility state
    delete visibilityState[contestAddress];
  }
};

export const clearStorageIfNeeded = () => {
  let session = sessionStorage.getItem(BROWSER_SESSION_CHECK_KEY);
  if (session == null) {
    removeFromLocalStorage(HIDDEN_PROPOSALS_STORAGE_KEY);
  }
  sessionStorage.setItem(BROWSER_SESSION_CHECK_KEY, "1");
};
