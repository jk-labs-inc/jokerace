import { FC } from "react";
import { CustomError, ErrorCodes } from "types/error";
import styles from "./styles.module.css";

interface TrackerDeployTransactionProps {
  error: CustomError;
  isLoading: boolean;
  isSuccess: boolean;
  transactionHref?: string;
  textSuccess?: React.ReactNode;
  textPending?: React.ReactNode;
}

export const TrackerDeployTransaction: FC<TrackerDeployTransactionProps> = ({
  error,
  isLoading,
  isSuccess,
  transactionHref,
  textSuccess,
  textPending,
}) => {
  const isUserRejectedTx = error?.code === ErrorCodes.USER_REJECTED_TX;

  if (isUserRejectedTx) return null;

  return (
    <>
      <ol className={`space-y-4 leading-[1.75] font-bold ${styles.stepper}`}>
        <li
          className={`${isLoading || isSuccess ? "text-primary-10" : error ? "text-negative-11" : "text-true-white"} ${
            isLoading ? "animate-pulse" : ""
          }`}
        >
          {error ? "Something went wrong during deployment." : textPending ?? "Deploying transaction..."}
        </li>
        <li className={isSuccess ? "text-primary-10" : "text-neutral-8"}>{textSuccess ?? "Deployed"}!</li>
      </ol>
      {error && (
        <p className="animate-appear mt-3 rounded bor px-4 border border-solid border-negative-4 py-2 text-negative-11 bg-negative-1">
          {error?.message}
        </p>
      )}

      {isSuccess && transactionHref && (
        <>
          <a className="mt-5 block" rel="nofollow noreferrer" target="_blank" href={transactionHref}>
            View transaction <span className="link">here</span>
          </a>
        </>
      )}
    </>
  );
};

export default TrackerDeployTransaction;
