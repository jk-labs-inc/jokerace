import { toast } from "react-toastify";
import ErrorToast from "./components/Error";
import SuccessToast from "./components/Success";
import WarningToast from "./components/Warning";

type ToastProps = string;

export const toastSuccess = (message: ToastProps) => {
  toast(<SuccessToast message={message} />, {
    type: toast.TYPE.SUCCESS,
  });
};

export const toastError = (message: ToastProps) => {
  toast(<ErrorToast message={message} />, {
    type: toast.TYPE.ERROR,
  });
};

export const toastWarning = (message: ToastProps) => {
  toast(<WarningToast message={message} />, {
    type: toast.TYPE.WARNING,
  });
};
