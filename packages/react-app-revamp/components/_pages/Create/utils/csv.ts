import { getAddress } from "ethers/lib/utils";

export const validateField = (address: string, votes: string): "address" | "votes" | "both" | null => {
  let error: "address" | "votes" | "both" | null = null;

  if (address.trim() === "") {
    error = "address";
  }

  try {
    getAddress(address);
  } catch (e) {
    error = "address";
  }

  if (votes.trim() === "" || Number(votes) <= 0) {
    error = error ? "both" : "votes";
  }

  return error;
};
