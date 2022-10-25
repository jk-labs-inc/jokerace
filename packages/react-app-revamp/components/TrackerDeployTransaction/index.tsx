import styles from "./styles.module.css";
interface TrackerDeployTransactionProps {
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
  transactionHref?: string
  textSuccess?: React.ReactNode
  textError?: React.ReactNode
  textPending?: React.ReactNode
}
export const TrackerDeployTransaction = (props: TrackerDeployTransactionProps) => {
  const { isError, isLoading, isSuccess, transactionHref, textSuccess, textError, textPending } = props;
  return (
    <>
      <ol className={`space-y-4 leading-[1.75] font-bold ${styles.stepper}`}>
        <li
          className={`${
            isLoading === true || isSuccess === true
              ? "text-primary-10"
              : isError === true
              ? "text-negative-11"
              : "text-true-white"
          } ${isLoading === true ? "animate-pulse" : ""}`}
        >
          {isError ? "Something went wrong during deployment." : textPending ?? "Deploying transaction..."}
        </li>
        <li className={isSuccess === true ? "text-primary-10" : "text-neutral-8"}>{textSuccess ?? "Deployed"}!</li>
      </ol>
      {isError && textError && <p className="animate-appear mt-3 rounded bor px-4 border border-solid border-negative-4 py-2 text-negative-11 bg-negative-1">
       {textError} 
      </p>}
      {isSuccess === true && transactionHref && (
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
