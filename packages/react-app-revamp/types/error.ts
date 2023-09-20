export interface TransactionError {
  message: string;
  cause?: {
    code?: number;
  };
}

export enum ErrorCodes {
  USER_REJECTED_TX = 4001,
}
