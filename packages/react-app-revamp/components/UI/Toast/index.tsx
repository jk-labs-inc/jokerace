import { toast } from "react-toastify";
import ErrorToast from "./components/Error";
import LoadingToast from "./components/Loading";
import SuccessToast from "./components/Success";
import WarningToast from "./components/Warning";

type ToastProps = string;

let toastId: any = null;

const createToast = (type: any, content: JSX.Element) => {
  if (toastId === null) {
    toastId = toast(content, {
      type,
      autoClose: type !== toast.TYPE.INFO ? 3000 : false,
      icon: false,
      onClose: () => {
        toastId = null;
      },
    });
  } else {
    toast.update(toastId, {
      type,
      autoClose: type !== toast.TYPE.INFO ? 3000 : false,
      render: content,
      icon: false,
    });
  }
};

export const toastSuccess = (message: ToastProps) => {
  createToast(toast.TYPE.SUCCESS, <SuccessToast message={message} />);
};

export const toastError = (message: ToastProps) => {
  createToast(toast.TYPE.ERROR, <ErrorToast message={message} />);
};

export const toastWarning = (message: ToastProps) => {
  createToast(toast.TYPE.WARNING, <WarningToast message={message} />);
};

export const toastLoading = (message: ToastProps) => {
  createToast(toast.TYPE.INFO, <LoadingToast message={message} />);
};

export const toastDismiss = () => {
  if (toastId !== null) {
    toast.dismiss(toastId);
    toastId = null;
  }
};
