import { ReactNode } from "react";

export interface ErrorResult {
  message: string;
  codeFound: boolean;
  additionalMessage?: ReactNode;
  isWarning?: boolean;
}

export interface ErrorDefinition {
  code: string;
  numericCode?: number;
  message: string;
  additionalMessage?: ReactNode;
  match?: (error: any) => boolean;
}
