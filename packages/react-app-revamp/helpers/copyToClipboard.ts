import toast from "react-hot-toast";
const toastOptions = {
  duration: 7000,
  position: "top-center",
  icon: "👏",
  // Aria
  ariaProps: {
    role: "status",
    "aria-live": "polite",
  },
};
export async function copyToClipboard(textToCopy: string, toastMessage: string) {
  if ("clipboard" in navigator) {
    await navigator.clipboard.writeText(textToCopy);
    toast(toastMessage, toastOptions);
  } else {
    document.execCommand("copy", true, textToCopy);
    toast(toastMessage, toastOptions);
  }
}
