import Button from "@components/UI/Button";
import DialogModal from "@components/UI/DialogModal";
import TrackerDeployTransaction from "@components/UI/TrackerDeployTransaction";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import { copyToClipboard } from "@helpers/copyToClipboard";
import { DuplicateIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import shallow from "zustand/shallow";
import Form from "../Step2/Form";
import { schema } from "../Step2/schema";
import useDeployToken from "../Step2/useDeployToken";
import { useStore } from "../store";

interface DialogModalMintProposalTokenProps {
  formCreateContestSetFields: any;
}
export const DialogModalMintProposalToken = (props: DialogModalMintProposalTokenProps) => {
  const { isConnected } = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const { formCreateContestSetFields } = props;
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
      //@ts-ignore
      dataDeploySubmissionToken: state.dataDeploySubmissionToken,
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
    if (modalDeploySubmissionTokenOpen === false && !stateContractDeployment.isLoading) {
      setShowDeploymentSteps(false);
    }
  }, [modalDeploySubmissionTokenOpen, stateContractDeployment.isLoading]);

  useEffect(() => {
    if (stateContractDeployment.isSuccess && dataDeploySubmissionToken?.address) {
      // set the value of the input with [name=submissionTokenAddress] in the form to our newly deployed token address
      formCreateContestSetFields("submissionTokenAddress", dataDeploySubmissionToken.address);
    }
  }, [stateContractDeployment.isSuccess, dataDeploySubmissionToken?.address]);

  // Make sure to reset the step tracker + deployment state when the modal opens
  useEffect(() => {
    setShowDeploymentSteps(false);
    stateContractDeployment.setIsLoading(false);
    stateContractDeployment.setIsSuccess(false);
    stateContractDeployment.setIsError(false);
    stateContractDeployment.setErrorMessage(null);
  }, []);

  return (
    <DialogModal
      isOpen={modalDeploySubmissionTokenOpen}
      setIsOpen={setModalDeploySubmissionTokenOpen}
      title="Mint submission token"
    >
      <div className="animate-appear">
        {showDeploymentSteps && (
          <TrackerDeployTransaction
            textError={stateContractDeployment.error}
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
              className="animate-appear mb-5 w-full py-1 xs:w-auto xs:min-w-fit-content"
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
