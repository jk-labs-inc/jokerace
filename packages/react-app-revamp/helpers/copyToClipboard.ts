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
    console.error("Failed to copy text: ", error);
    toast.error("Failed to copy text to clipboard", {
      position: "top-center",
      icon: "🙅‍♀️",
    });
  }
};
