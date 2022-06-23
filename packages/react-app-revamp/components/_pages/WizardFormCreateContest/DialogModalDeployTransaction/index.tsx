import DialogModal from "@components/DialogModal";
import type { DialogModalProps } from '@components/DialogModal'
import TrackerDeployTransaction from "@components/TrackerDeployTransaction";

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
        <TrackerDeployTransaction isError={isError} isLoading={isLoading} isSuccess={isSuccess} transactionHref={transactionHref} />
        {children}
    </DialogModal>
}

export default DialogModalDeployTransaction