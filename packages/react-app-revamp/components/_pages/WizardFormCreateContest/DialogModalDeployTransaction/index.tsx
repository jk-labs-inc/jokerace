import type { DialogModalProps } from "@components/UI/DialogModal";
import DialogModal from "@components/UI/DialogModal";
import TrackerDeployTransaction from "@components/UI/TrackerDeployTransaction";
import { FC } from "react";
import { CustomError } from "types/error";

interface DialogModalDeployTransactionProps extends DialogModalProps {
  transactionHref?: string;
  textPending?: string;
  error: CustomError | null;
  isLoading: boolean;
  isSuccess: boolean;
}

export const DialogModalDeployTransaction: FC<DialogModalDeployTransactionProps> = ({
  children,
  isLoading,
  isSuccess,
  error,
  textPending,
  transactionHref,
  ...rest
}) => {
  return (
    <DialogModal {...rest}>
      <TrackerDeployTransaction
        error={error}
        isLoading={isLoading}
        isSuccess={isSuccess}
        textPending={textPending}
        transactionHref={transactionHref}
      />
      {children}
    </DialogModal>
  );
};

export default DialogModalDeployTransaction;
