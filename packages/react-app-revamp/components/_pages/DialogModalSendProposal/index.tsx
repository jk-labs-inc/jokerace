import DialogModal from "@components/DialogModal";

export const DialogModalSendProposal = props => {
  const { children, ...rest } = props;
  return (
    <DialogModal title="Send a proposal" {...rest}>
      {children}
    </DialogModal>
  );
};

export default DialogModalSendProposal;
