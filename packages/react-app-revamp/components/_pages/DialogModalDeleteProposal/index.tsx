import Button from "@components/Button";
import DialogModal from "@components/DialogModal";
import TrackerDeployTransaction from "@components/TrackerDeployTransaction";
import useDeleteProposal from "@hooks/useDeleteProposal";
import { useDeleteProposalStore } from "@hooks/useDeleteProposal/store";

interface DialogDeleteProposalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const DialogModalDeleteProposal = (props: DialogDeleteProposalProps) => {
  const { transactionData } = useDeleteProposalStore(state => ({
    transactionData: state.transactionData,
  }));

  const { deleteProposal, isLoading, isError, isSuccess, error } = useDeleteProposal();
  return (
    <DialogModal title="Delete this proposal" {...props}>
      {(isSuccess === true || isLoading === true || isError === true) && (
        <div className="animate-appear mt-2 mb-4">
          <TrackerDeployTransaction textError={error} isSuccess={isSuccess} isError={isError} isLoading={isLoading} />
        </div>
      )}

      {isSuccess === true && transactionData?.transactionHref && (
        <div className="my-2 animate-appear">
          <a rel="nofollow noreferrer" target="_blank" href={transactionData?.transactionHref}>
            View transaction <span className="link">here</span>
          </a>
        </div>
      )}

      {!isLoading && !isError && !isSuccess && (
        <p className="animate-appear font-bold text-center mt-3 mb-6">
          Are you sure you want to delete this submission ?
        </p>
      )}
      <div className="mb-4 pt-2 animate-appear flex flex-col space-y-4 xs:flex-row xs:space-y-0 xs:space-i-3">
        {!isSuccess && (
          <Button disabled={isLoading} isLoading={isLoading} onClick={() => deleteProposal()}>
            {isError ? "Try again" : "Yes, delete this proposal"}
          </Button>
        )}
        <Button disabled={isLoading} intent="neutral-outline" onClick={() => props.setIsOpen(false)}>
          {isSuccess ? "Go back" : "Cancel"}
        </Button>
      </div>
    </DialogModal>
  );
};

export default DialogModalDeleteProposal;
