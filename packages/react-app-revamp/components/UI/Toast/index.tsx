import { toast } from "react-toastify";
import ErrorToast from "./components/Error";
import LoadingToast from "./components/Loading";
import SuccessToast from "./components/Success";
import WarningToast from "./components/Warning";

let toastId: any = null;

const commonSettings = {
  autoClose: 4000,
  icon: false,
  onClose: () => {
    toastId = null;
  },
};

const createToast = (type: any, content: JSX.Element, additionalSettings: any = {}) => {
  const settings = { ...commonSettings, ...additionalSettings, type };

  if (toastId !== null) {
    toast.dismiss(toastId);
  }

  toastId = toast(content, settings);
};

export const toastSuccess = (message: string) => {
  createToast(toast.TYPE.SUCCESS, <SuccessToast message={message} />);
};

export const toastError = (message: string, messageToCopy?: string) => {
  createToast(toast.TYPE.ERROR, <ErrorToast messageToShow={message} messageToCopy={messageToCopy} />, {
    autoClose: false,
    className: "error-toast",
  });
};

export const toastWarning = (message: string) => {
  createToast(toast.TYPE.WARNING, <WarningToast message={message} />);
};

export const toastLoading = (message: string, showSignMessage?: boolean) => {
  createToast(toast.TYPE.INFO, <LoadingToast message={message} showSignMessage={showSignMessage} />, {
    autoClose: false,
  });
};

export const toastDismiss = () => {
  if (toastId !== null) {
    toast.dismiss(toastId);
    toastId = null;
  }
};
