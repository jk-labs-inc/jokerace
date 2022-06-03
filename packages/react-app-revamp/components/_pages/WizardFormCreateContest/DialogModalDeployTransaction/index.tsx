import DialogModal from "@components/DialogModal";
import type { DialogModalProps } from '@components/DialogModal'
import styles from './styles.module.css'

interface DialogModalDeployTransaction extends DialogModalProps {
  transactionHref: string
  error?: Error
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
}

export const DialogModalDeployTransaction = (props: DialogModalDeployTransaction) => {
    const { children, isError, isLoading, isSuccess, error, transactionHref,...rest } = props

    return <DialogModal {...rest}>
        <ol className={`space-y-4 font-bold ${styles.stepper}`}>
            <li className={`${isLoading  === true || isSuccess === true ? 'text-primary-10' : isError  === true ? 'text-negative-11' : 'text-true-white'} ${isLoading === true ? 'animate-pulse' : ""}`}>
                {isError ? 'Something went wrong during deployment, please try again.' : "Deploying transaction..."}
                </li>
            <li className={isSuccess === true ? 'text-primary-10' : 'text-neutral-8'}>Deployed!</li>
        </ol>

        {isSuccess === true && transactionHref && <>
            <a className="mt-5 block" target='_black' href={transactionHref}>
                View transaction <span className="font-bold text-positive-9 underline focus:text-positive-10 hover:no-underline">here</span>
            </a>
        </>}
        {children}
    </DialogModal>
}

export default DialogModalDeployTransaction