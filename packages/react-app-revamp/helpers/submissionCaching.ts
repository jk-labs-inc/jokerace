import { loadFromLocalStorage, saveToLocalStorage } from "./localStorage";

export interface SubmissionCache {
  contestId: string;
  content: string;
  expiresAt: Date;
}

export const saveSubmissionToLocalStorage = (key: string, submissionCache: SubmissionCache) => {
  const submissions: SubmissionCache[] = loadFromLocalStorage(key, []);

  const index = submissions.findIndex(submission => submission.contestId === submissionCache.contestId);

  if (index !== -1) {
    submissions[index] = submissionCache;
  } else {
    submissions.push(submissionCache);
  }

  saveToLocalStorage(key, submissions);
};

export const loadSubmissionFromLocalStorage = (key: string, contestId: string): SubmissionCache | null => {
  const submissions: SubmissionCache[] = loadFromLocalStorage(key, []);

  const submissionCache = submissions.find(submission => submission.contestId === contestId);

  if (submissionCache) {
    const currentTime = new Date();
    const expiresAt = submissionCache.expiresAt;

    if (currentTime > expiresAt) {
      removeSubmissionFromLocalStorage(key, contestId);
      return null;
    } else {
      return submissionCache;
    }
  }

  return null;
};

export function removeSubmissionFromLocalStorage(key: string, contestId: string) {
  const submissions: SubmissionCache[] = loadFromLocalStorage(key, []);

  const updatedSubmissions = submissions.filter(submission => submission.contestId !== contestId);

  saveToLocalStorage(key, updatedSubmissions);
}
