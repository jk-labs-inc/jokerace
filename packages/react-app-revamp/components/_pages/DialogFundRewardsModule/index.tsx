import DialogModal from "@components/UI/DialogModal";
import TrackerDeployTransaction from "@components/UI/TrackerDeployTransaction";
import useFundRewardsModule from "@hooks/useFundRewards";
import Form from "./Form";

interface DialogFundRewardsModuleProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

export const DialogFundRewardsModule = (props: DialogFundRewardsModuleProps) => {
  const { ...dialogProps } = props;
  const { sendFundsToRewardsModule, transactionData, isLoading, isError, isSuccess, error } = useFundRewardsModule();

  return (
    <DialogModal title="Send funds to rewards module" {...dialogProps}>
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

      <div className="animate-appear mt-3 mb-6">
        <Form
          isSuccess={isSuccess}
          setIsModalOpen={dialogProps.setIsOpen}
          handleSubmit={sendFundsToRewardsModule}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </DialogModal>
  );
};

export default DialogFundRewardsModule;
