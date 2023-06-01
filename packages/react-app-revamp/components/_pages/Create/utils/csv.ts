import { getAddress } from "ethers/lib/utils";

export const validateVotingFields = (address: string, votes: string): "address" | "votes" | "both" | null => {
  // If both address and votes are empty, consider it as a valid case
  if (address === "" && votes === "") {
    return null;
  }
  let error: "address" | "votes" | "both" | null = null;

  if (address.trim() === "") {
    error = "address";
  }

  try {
    getAddress(address);
  } catch (e) {
    error = "address";
  }

  if (votes.trim() === "" || Number(votes) <= 0 || isNaN(Number(votes))) {
    error = error ? "both" : "votes";
  }

  return error;
};

export const validateSubmissionFields = (address: string): boolean => {
  if (address === "") {
    return true;
  }

  try {
    getAddress(address);
    return false;
  } catch (e) {
    return true;
  }
};
