export interface CustomError {
  message?: string;
  code?: number;
}

export enum ErrorCodes {
  USER_REJECTED_TX = 4001,
}
