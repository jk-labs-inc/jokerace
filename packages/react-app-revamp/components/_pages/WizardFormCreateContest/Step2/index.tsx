import Button from "@components/Button";
import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import { copyToClipboard } from "@helpers/copyToClipboard";
import { DuplicateIcon } from "@heroicons/react/outline";
import { useConnect } from "wagmi";
import { DialogModalDeployTransaction } from "../DialogModalDeployTransaction";
import { useStore } from "../store";
import Form from "./Form";
import { schema } from "./schema";
import { useDeployToken } from "./useDeployToken";
export const Step2 = () => {
  const stateWizardForm = useStore();
  const form = useForm({
    extend: validator({ schema }),
    onSubmit: values => handleSubmitForm(values),
  });
  const { handleSubmitForm, stateContractDeployment } = useDeployToken(form);
  const { isConnected } = useConnect();
  return (
    <>
      <div className="tracking-wide pb-5">
        <h2 className="sr-only">Step 2: Mint a token</h2>
        <p className="font-bold text-lg mb-3">Let’s start by minting a token your community will use to vote.</p>
        <p className="text-neutral-11 text-xs">
          You can use your own, but it needs to be compatible with our contest contracts, so we *strongly* recommend
          minting it here.
        </p>
      </div>
      <Form isDeploying={stateContractDeployment.isLoading} {...form} />
      <DialogModalDeployTransaction
        isOpen={stateWizardForm.modalDeployTokenOpen}
        setIsOpen={stateWizardForm.setModalDeployTokenOpen}
        title="Token deployment transaction"
        isError={stateContractDeployment.isError}
        isLoading={stateContractDeployment.isLoading}
        isSuccess={stateContractDeployment.isSuccess}
        error={stateContractDeployment.error}
        transactionHref={`${stateWizardForm.tokenDeployedToChain?.blockExplorers?.default?.url}/tx/${stateWizardForm?.dataDeployToken?.hash}`}
      >
        {stateContractDeployment.isSuccess === true && (
          <div className="mt-3 animate-appear relative">
            <span className="font-bold">Token address:</span>
            <div className="relative focus-within:text-opacity-50 hover:text-opacity-75">
              <button
                onClick={() => copyToClipboard(stateWizardForm.dataDeployToken?.address, "Token address copied !")}
                title="Copy address"
                className="w-full absolute z-10 inset-0 opacity-0"
              >
                Copy address
              </button>
              <p className="pie-6 text-opacity-[inherit] text-neutral-12 font-mono overflow-hidden text-ellipsis">
                {stateWizardForm.dataDeployToken?.address}
              </p>
              <DuplicateIcon className="absolute w-5 top-1/2 inline-end-0 -translate-y-1/2" />
            </div>
          </div>
        )}

        <div className="pt-6 flex flex-col space-y-3 xs:flex-row xs:space-y-0 xs:space-i-3">
          <Button
            className="w-full py-1 xs:min-w-fit-content xs:w-auto"
            onClick={() => stateWizardForm.setCurrentStep(3)}
            disabled={!stateContractDeployment.isSuccess}
            intent="neutral-outline"
          >
            Next
          </Button>
          {stateContractDeployment.isError && (
            <Button
              onClick={() => {
                handleSubmitForm(form.data());
              }}
              className="w-full py-1 xs:w-auto xs:min-w-fit-content"
              disabled={stateContractDeployment.isLoading || !isConnected}
              intent="neutral-outline"
              type="submit"
            >
              Try again
            </Button>
          )}
        </div>
      </DialogModalDeployTransaction>
    </>
  );
};

export default Step2;
