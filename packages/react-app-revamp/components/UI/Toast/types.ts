import { ReactNode } from "react";

export { ErrorToastType } from "./components/Error";
export { LoadingToastMessageType } from "./components/Loading";
import { ErrorToastType } from "./components/Error";
import { LoadingToastMessageType } from "./components/Loading";

export interface BaseToastConfig {
  message: string | ReactNode;
}

export interface InfoToastConfig extends BaseToastConfig {
  message: ReactNode;
  additionalMessage?: string;
}

export interface SuccessToastConfig extends BaseToastConfig {
  message: string;
}

export interface ErrorToastConfig extends BaseToastConfig {
  message: string;
  additionalMessage?: string;
  messageToCopy?: string;
  type?: ErrorToastType;
  codeFound?: boolean;
}

export interface WarningToastConfig extends BaseToastConfig {
  message: string;
  additionalMessage?: string;
}

export interface LoadingToastConfig extends BaseToastConfig {
  message: string;
  additionalMessageType?: LoadingToastMessageType;
}

export type ToastConfig = InfoToastConfig | SuccessToastConfig | ErrorToastConfig | LoadingToastConfig;
