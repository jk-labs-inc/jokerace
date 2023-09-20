import { toastError } from "@components/UI/Toast";
import { toast } from "react-toastify";
import { TransactionError } from "types/error";

export const copyToClipboard = async (textToCopy: string, toastMessage: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    toast(toastMessage, {
      position: "top-center",
      icon: "👏",
      hideProgressBar: true,
    });
  } catch (error) {
    const transactionError = error as TransactionError;
    console.error("Failed to copy text: ", error);
    toastError("Failed to copy text to clipboard", transactionError.message);
  }
};
