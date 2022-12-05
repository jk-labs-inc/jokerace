import DialogModal from "@components/DialogModal";
import type { DialogModalProps } from '@components/DialogModal'
import TrackerDeployTransaction from "@components/TrackerDeployTransaction";

interface DialogModalDeployTransaction extends DialogModalProps {
  transactionHref?: string
  textPending?: string
  error?: React.ReactNode
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
}

export const DialogModalDeployTransaction = (props: DialogModalDeployTransaction) => {
    const { children, isError, isLoading, isSuccess, error, textPending, transactionHref, ...rest } = props
    return <DialogModal {...rest}>
        <TrackerDeployTransaction
          textError={error}
          isError={isError}
          isLoading={isLoading}
          isSuccess={isSuccess}
          textPending={textPending}
          transactionHref={transactionHref}
        />
        {children}
    </DialogModal>
}

export default DialogModalDeployTransaction