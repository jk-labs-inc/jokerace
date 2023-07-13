import { toast } from "react-toastify";
import ErrorToast from "./components/Error";
import LoadingToast from "./components/Loading";
import SuccessToast from "./components/Success";
import WarningToast from "./components/Warning";

let toastId: any = null;

const createToast = (type: any, content: JSX.Element) => {
  if (toastId === null) {
    toastId = toast(content, {
      type,
      autoClose: type !== toast.TYPE.INFO ? 4000 : false,
      icon: false,
      onClose: () => {
        toastId = null;
      },
    });
  } else {
    toast.update(toastId, {
      type,
      autoClose: type !== toast.TYPE.INFO ? 4000 : false,
      render: content,
      icon: false,
    });
  }
};

export const toastSuccess = (message: string) => {
  createToast(toast.TYPE.SUCCESS, <SuccessToast message={message} />);
};

export const toastError = (message: string, messageToCopy?: string) => {
  createToast(toast.TYPE.ERROR, <ErrorToast messageToShow={message} messageToCopy={messageToCopy} />);
};

export const toastWarning = (message: string) => {
  createToast(toast.TYPE.WARNING, <WarningToast message={message} />);
};

export const toastLoading = (message: string, showSignMessage?: boolean) => {
  createToast(toast.TYPE.INFO, <LoadingToast message={message} showSignMessage={showSignMessage} />);
};

export const toastDismiss = () => {
  if (toastId !== null) {
    toast.dismiss(toastId);
    toastId = null;
  }
};
