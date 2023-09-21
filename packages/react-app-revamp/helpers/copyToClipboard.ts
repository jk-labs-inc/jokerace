import { toastError } from "@components/UI/Toast";
import { toast } from "react-toastify";

export const copyToClipboard = async (textToCopy: string, toastMessage: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    toast(toastMessage, {
      position: "top-center",
      icon: "👏",
      hideProgressBar: true,
    });
  } catch (error) {
    toastError("Failed to copy text to clipboard");
  }
};
