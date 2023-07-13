export interface CustomError {
  message: string;
  code?: string;
}

export enum ErrorCodes {
  USER_REJECTED_TX = "ACTION_REJECTED",
}
