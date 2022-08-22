import { useAccount } from "wagmi";
import shallow from "zustand/shallow";
import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import Button from "@components/Button";
import DialogModal from "@components/DialogModal";
import TrackerDeployTransaction from "@components/TrackerDeployTransaction";
import { copyToClipboard } from "@helpers/copyToClipboard";
import { DuplicateIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Form from "../Step2/Form";
import { schema } from "../Step2/schema";
import useDeployToken from "../Step2/useDeployToken";
import { useStore } from "../store";

export const DialogModalMintProposalToken = (props: any) => {
  const { isConnected } = useAccount();

  const {
    tokenDeployedToChain,
    dataDeploySubmissionToken,
    setModalDeploySubmissionTokenOpen,
    modalDeploySubmissionTokenOpen,
  } = useStore(
    state => ({
      //@ts-ignore
      setCurrentStep: state.setCurrentStep,
      //@ts-ignore
      dataDeploySubmissionToken: state.dataDeploySubmissionToken,
      //@ts-ignore
      modalDeploySubmissionTokenOpen: state.modalDeploySubmissionTokenOpen,
      //@ts-ignore
      setModalDeploySubmissionTokenOpen: state.setModalDeploySubmissionTokenOpen,
      //@ts-ignore
      tokenDeployedToChain: state.tokenDeployedToChain,
    }),
    shallow,
  );
  const form = useForm({
    extend: validator({ schema }),
    onSubmit: values => handleSubmitForm(values, true),
  });
  const { handleSubmitForm, stateContractDeployment } = useDeployToken(form);
  const [showDeploymentSteps, setShowDeploymentSteps] = useState(false);

  useEffect(() => {
    if (
      stateContractDeployment.isLoading === true ||
      stateContractDeployment.error !== null ||
      stateContractDeployment.isSuccess === true
    )
      setShowDeploymentSteps(true);
  }, [stateContractDeployment.isSuccess, stateContractDeployment.isLoading, stateContractDeployment.error]);

  useEffect(() => {
    if (props.isOpen === false && !stateContractDeployment.isLoading) {
      setShowDeploymentSteps(false);
    }
  }, [props.isOpen, stateContractDeployment.isLoading]);

  return (
    <DialogModal
      isOpen={modalDeploySubmissionTokenOpen}
      setIsOpen={setModalDeploySubmissionTokenOpen}
      title="Mint submission token"
    >
      <div className="animate-appear">
        {showDeploymentSteps && (
          <TrackerDeployTransaction
            isError={stateContractDeployment.isError}
            isLoading={stateContractDeployment.isLoading}
            isSuccess={stateContractDeployment.isSuccess}
            transactionHref={tokenDeployedToChain.transactionHref}
          />
        )}
        {stateContractDeployment.isSuccess === true && (
          <div className="mt-3 animate-appear relative">
            <span className="font-bold">Token address:</span>
            <div className="relative focus-within:text-opacity-50 hover:text-opacity-75">
              <button
                onClick={() => copyToClipboard(dataDeploySubmissionToken?.address, "Token address copied !")}
                title="Copy address"
                type="button"
                className="w-full absolute z-10 inset-0 opacity-0"
              >
                Copy address
              </button>
              <p className="pie-6 text-opacity-[inherit] text-neutral-12 font-mono overflow-hidden text-ellipsis">
                {dataDeploySubmissionToken?.address}
              </p>
              <DuplicateIcon className="absolute w-5 top-1/2 inline-end-0 -translate-y-1/2" />
            </div>
          </div>
        )}

        <div className="pt-6 flex flex-col space-y-3 xs:flex-row xs:space-y-0 xs:space-i-3">
          {stateContractDeployment.isSuccess && (
            <Button
              className="animate-appear w-full py-1 xs:min-w-fit-content xs:w-auto"
              onClick={() => setModalDeploySubmissionTokenOpen(false)}
              disabled={!stateContractDeployment.isSuccess}
              intent="neutral-outline"
              type="button"
            >
              Go back to contest creation
            </Button>
          )}
          {stateContractDeployment.isError && (
            <Button
              onClick={() => {
                handleSubmitForm(form.data(), true);
              }}
              className="animate-appear w-full py-1 xs:w-auto xs:min-w-fit-content"
              disabled={stateContractDeployment.isLoading || !isConnected}
              intent="neutral-outline"
              type="button"
            >
              Try again
            </Button>
          )}
        </div>
        {!stateContractDeployment.isSuccess && (
          <Form showSkipButton={false} isDeploying={stateContractDeployment.isLoading} {...form} />
        )}
      </div>
    </DialogModal>
  );
};

export default DialogModalMintProposalToken;
