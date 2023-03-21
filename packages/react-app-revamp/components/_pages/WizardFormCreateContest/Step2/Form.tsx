/* eslint-disable react-hooks/exhaustive-deps */
import Button from "@components/UI/Button";
import button from "@components/UI/Button/styles";
import FormField from "@components/UI/FormField";
import FormInput from "@components/UI/FormInput";
import ToggleSwitch from "@components/UI/ToggleSwitch";
import { ofacAddresses } from "@config/ofac-addresses/ofac-addresses";
import { usePress } from "@react-aria/interactions";
import { useId } from "react";
import { useAccount, useNetwork } from "wagmi";
import shallow from "zustand/shallow";
import { useStore } from "../store";

interface FormProps {
  showSkipButton: boolean;
  isDeploying: boolean;
  // the following are returned by felte hook useForm()
  form: any;
  touched: any;
  data: any;
  errors: any;
  isValid: any;
  interacted: any;
  resetField: any;
  setData: any;
  setFields: any;
}
const appearAsNeutralButton = button({ intent: "ghost-neutral", scale: "sm", class: "sm:w-fit-content" });

export const Form = (props: FormProps) => {
  const formId = useId();
  const { isDeploying, form, data, errors, isValid, interacted, setData, setFields, showSkipButton } = props;
  const account = useAccount({
    onConnect({ address }) {
      if (address != undefined && ofacAddresses.includes(address?.toString())) {
        location.href = "https://www.google.com/search?q=what+are+ofac+sanctions";
      }
    },
  });
  const { chain } = useNetwork();
  const { setCurrentStep, dataDeployVotingToken } = useStore(
    state => ({
      //@ts-ignore
      setCurrentStep: state.setCurrentStep,
      //@ts-ignore
      dataDeployVotingToken: state.dataDeployVotingToken,
    }),
    shallow,
  );
  const { pressProps } = usePress({
    onPress: () => setCurrentStep(3),
  });

  return (
    <form ref={form} className="w-full" id={formId}>
      <fieldset className="space-y-6">
        <FormField disabled={!account.isConnected || chain?.unsupported || isDeploying}>
          <FormField.InputField>
            <FormField.Label hasError={errors().tokenName?.length > 0} htmlFor="tokenName">
              Token name <span className="text-2xs text-neutral-10 pis-1">(max. 30 characters)</span>
            </FormField.Label>
            <FormField.Description id="input-tokenname-description">The name of your token</FormField.Description>
            <FormInput
              required
              disabled={!account.isConnected || chain?.unsupported || isDeploying}
              aria-invalid={errors().tokenName?.length > 0 ? "true" : "false"}
              className="max-w-full w-auto 2xs:w-full"
              placeholder="My token"
              type="text"
              name="tokenName"
              id="tokenName"
              maxLength={30}
              hasError={errors().tokenName?.length > 0}
              aria-describedby="input-tokenname-description input-tokenname-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={errors().tokenName?.length > 0} id="input-tokenname-helpblock">
            Please type a token name that is at most 30 characters.
          </FormField.HelpBlock>
        </FormField>

        <FormField disabled={!account.isConnected || chain?.unsupported || isDeploying}>
          <FormField.InputField>
            <FormField.Label hasError={errors().tokenSymbol?.length > 0} htmlFor="tokenSymbol">
              Token symbol <span className="text-2xs text-neutral-10 pis-1">(max. 10 characters)</span>
            </FormField.Label>
            <FormField.Description id="input-tokensymbol-description">The name of your token</FormField.Description>
            <div className="w-full relative">
              <div className="pointer-events-none font-bold absolute inset-0 text-sm h-full aspect-square justify-center items-center flex">
                $
              </div>
              <FormInput
                required
                disabled={!account.isConnected || chain?.unsupported || isDeploying}
                aria-invalid={errors().tokenSymbol?.length > 0 ? "true" : "false"}
                className="pis-9 max-w-full w-auto 2xs:w-full"
                placeholder="TOKEN"
                type="text"
                name="tokenSymbol"
                id="tokenSymbol"
                maxLength={10}
                hasError={errors().tokenSymbol?.length > 0}
                aria-describedby="input-tokensymbol-description input-tokensymbol-helpblock"
              />
            </div>
          </FormField.InputField>
          <FormField.HelpBlock hasError={errors().tokenSymbol?.length > 0} id="input-tokensymbol-helpblock">
            Your token symbol can be at most 10 characters.
          </FormField.HelpBlock>
        </FormField>

        <FormField disabled={!account.isConnected || chain?.unsupported || isDeploying}>
          <FormField.InputField>
            <FormField.Label hasError={errors().receivingAddress?.length > 0} htmlFor="receivingAddress">
              Receiving address <span className="text-2xs text-neutral-10 pis-1">(Ethereum address)</span>
            </FormField.Label>
            <FormField.Description id="input-receivingaddress-description">
              An Ethereum address that will receive the tokens
            </FormField.Description>
            <FormInput
              required
              disabled={!account.isConnected || chain?.unsupported || isDeploying}
              aria-invalid={errors().receivingAddress?.length > 0 ? "true" : "false"}
              className="max-w-full w-auto 2xs:w-full"
              placeholder="0x..."
              type="text"
              name="receivingAddress"
              id="receivingAddress"
              hasError={errors().receivingAddress?.length > 0}
              aria-describedby="input-receivingaddress-description input-receivingaddress-helpblock"
            />
            <div className="mt-2 space-y-2 items-center flex flex-col 2xs:flex-row">
              <span className="text-neutral-10 pie-1ex text-xs">or</span>
              <Button
                /* @ts-ignore */
                onClick={() => {
                  setFields(($data: any) => ({ ...$data, receivingAddress: account?.address }));
                }}
                disabled={!account.isConnected || chain?.unsupported || isDeploying}
                className="w-full 2xs:w-auto"
                type="button"
                scale="xs"
                intent="true-solid-outline"
              >
                Use my address
              </Button>
            </div>
          </FormField.InputField>
          <FormField.HelpBlock hasError={errors().receivingAddress?.length > 0} id="input-receivingaddress-helpblock">
            Please type a valid Ethereum address.
          </FormField.HelpBlock>
        </FormField>

        <FormField disabled={!account.isConnected || chain?.unsupported || isDeploying}>
          <FormField.InputField>
            <FormField.Label hasError={errors().numberOfTokens?.length > 0} htmlFor="numberOfTokens">
              Number of tokens{" "}
              <span className="text-2xs text-neutral-10 pis-1">
                (min. <span className="font-mono">1</span>)
              </span>
            </FormField.Label>
            <FormField.Description id="input-numberoftokens-description">
              The number of tokens you want to create.
            </FormField.Description>
            <FormInput
              required
              disabled={!account.isConnected || chain?.unsupported || isDeploying}
              aria-invalid={errors().numberOfTokens?.length > 0 ? "true" : "false"}
              className="max-w-full w-auto 2xs:w-full"
              placeholder="10000000000"
              type="number"
              name="numberOfTokens"
              id="numberOfTokens"
              min={1}
              step={1}
              hasError={errors().numberOfTokens?.length > 0}
              aria-describedby="input-numberoftokens-description input-numberoftokens-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={errors().numberOfTokens?.length > 0} id="input-numberoftokens-helpblock">
            Please type a positive number.
          </FormField.HelpBlock>
        </FormField>
        <FormField disabled={!account.isConnected || chain?.unsupported || isDeploying}>
          <ToggleSwitch
            label="Non-transferable"
            disabled={!account.isConnected || chain?.unsupported || isDeploying}
            checked={data().nonTransferable ?? false}
            onChange={(e: boolean) => {
              setData("nonTransferable", e);
            }}
            name="nonTransferable"
            helpText={
              <>
                (if selected, only you will be able to <br />
                transfer the tokens)
              </>
            }
          />
        </FormField>
      </fieldset>
      <div className="pt-8 md:pt-12 flex flex-col gap-8">
        <Button
          className="sm:w-fit-content"
          isLoading={isDeploying}
          //@ts-ignore
          disabled={
            !account.isConnected || chain?.unsupported || isDeploying || isValid() === false || interacted() === null
          }
          type="submit"
        >
          Mint
        </Button>

        {showSkipButton && (
          <div>
            <span className="text-2xs text-neutral-9 font-medium pie-1ex">or</span>
            <div
              className={`${appearAsNeutralButton} ${
                dataDeployVotingToken === null ? "opacity-75 hover:opacity-90 focus:opacity-100" : ""
              }`}
              tabIndex={0}
              role="button"
              {...pressProps}
            >
              {dataDeployVotingToken !== null ? "Next" : "Skip"}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default Form;
