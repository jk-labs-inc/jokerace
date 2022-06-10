import { useNetwork, useConnect, useSigner } from "wagmi";
import { usePress } from "@react-aria/interactions";
import FormField from "@components/FormField";
import FormInput from "@components/FormInput";
import Button from "@components/Button";
import ToggleSwitch from "@components/ToggleSwitch";
import button from "@components/Button/styles";
import { useStore } from "../store";
import type { WizardFormState } from '../store'

interface FormProps {
  isDeploying: boolean
  // the following are returned by felte hook useForm()
  form: any
  touched: any
  data: any
  errors: any
  isValid: any
  interacted: any
  resetField: any
  setData: any
}
const appearAsNeutralButton = button({ intent: "neutral-outline" });

export const Form = (props: FormProps) => {
  const { isDeploying, form, data, errors, isValid, interacted, setData } = props;
  const { isConnected } = useConnect();
  const { activeChain } = useNetwork();
  //@ts-ignore
  const stateWizardForm: WizardFormState = useStore();
  const { pressProps } = usePress({
    onPress: () => stateWizardForm.setCurrentStep(3),
  });

  return (
    <form ref={form} className="w-full">
      <fieldset className="space-y-6">
        <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
          <FormField.InputField>
            <FormField.Label hasError={errors().tokenName?.length > 0 === true} htmlFor="tokenName">
              Token name <span className="text-2xs text-neutral-10 pis-1">(max. 30 characters)</span>
            </FormField.Label>
            <FormField.Description id="input-tokenname-description">The name of your token</FormField.Description>
            <FormInput
              required
              disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
              aria-invalid={errors().tokenName?.length > 0 === true ? "true" : "false"}
              className="max-w-full w-auto 2xs:w-full"
              placeholder="My token"
              type="text"
              name="tokenName"
              id="tokenName"
              maxLength={30}
              hasError={errors().tokenName?.length > 0 === true}
              aria-describedby="input-tokenname-description input-tokenname-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={errors().tokenName?.length > 0 === true} id="input-tokenname-helpblock">
            Please type a token name that is at most 30 characters.
          </FormField.HelpBlock>
        </FormField>

        <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
          <FormField.InputField>
            <FormField.Label hasError={errors().tokenSymbol?.length > 0 === true} htmlFor="tokenSymbol">
              Token symbol <span className="text-2xs text-neutral-10 pis-1">(max. 10 characters)</span>
            </FormField.Label>
            <FormField.Description id="input-tokensymbol-description">The name of your token</FormField.Description>
            <div className="w-full relative">
              <div className="pointer-events-none font-bold absolute inset-0 text-sm h-full aspect-square justify-center items-center flex">
                $
              </div>
              <FormInput
                required
                disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
                aria-invalid={errors().tokenSymbol?.length > 0 === true ? "true" : "false"}
                className="pis-9 max-w-full w-auto 2xs:w-full"
                placeholder="TOKEN"
                type="text"
                name="tokenSymbol"
                id="tokenSymbol"
                maxLength={10}
                hasError={errors().tokenSymbol?.length > 0 === true}
                aria-describedby="input-tokensymbol-description input-tokensymbol-helpblock"
              />
            </div>
          </FormField.InputField>
          <FormField.HelpBlock hasError={errors().tokenSymbol?.length > 0 === true} id="input-tokensymbol-helpblock">
            Your token symbol can be at most 10 characters.
          </FormField.HelpBlock>
        </FormField>

        <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
          <FormField.InputField>
            <FormField.Label hasError={errors().receivingAddress?.length > 0 === true} htmlFor="receivingAddress">
              Receiving address <span className="text-2xs text-neutral-10 pis-1">(Ethereum address)</span>
            </FormField.Label>
            <FormField.Description id="input-receivingaddress-description">
              An Ethereum address that will receive the tokens
            </FormField.Description>
            <FormInput
              required
              disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
              aria-invalid={errors().receivingAddress?.length > 0 === true ? "true" : "false"}
              className="max-w-full w-auto 2xs:w-full"
              placeholder="0x..."
              type="text"
              name="receivingAddress"
              id="receivingAddress"
              hasError={errors().receivingAddress?.length > 0 === true}
              aria-describedby="input-receivingaddress-description input-receivingaddress-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock
            hasError={errors().receivingAddress?.length > 0 === true}
            id="input-receivingaddress-helpblock"
          >
            Please type a valid Ethereum address.
          </FormField.HelpBlock>
        </FormField>

        <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
          <FormField.InputField>
            <FormField.Label hasError={errors().numberOfTokens?.length > 0 === true} htmlFor="numberOfTokens">
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
              disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
              aria-invalid={errors().numberOfTokens?.length > 0 === true ? "true" : "false"}
              className="max-w-full w-auto 2xs:w-full"
              placeholder="10000000000"
              type="number"
              name="numberOfTokens"
              id="numberOfTokens"
              min={1}
              step={1}
              hasError={errors().numberOfTokens?.length > 0 === true}
              aria-describedby="input-numberoftokens-description input-numberoftokens-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock
            hasError={errors().numberOfTokens?.length > 0 === true}
            id="input-numberoftokens-helpblock"
          >
            Please type a positive number.
          </FormField.HelpBlock>
        </FormField>
        <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
          <ToggleSwitch
            label="Non-transferable"
            disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
            checked={data().nonTransferable}
            onChange={(e: boolean) => setData("nonTransferable", e)}
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
      <div className="pt-6 flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
        <Button
          isLoading={isDeploying === true}
          //@ts-ignore
          intent="neutral-oultine"
          disabled={
            !isConnected ||
            activeChain?.unsupported === true ||
            isDeploying === true ||
            isValid() === false ||
            interacted() === null
          }
          type="submit"
        >
          Mint
        </Button>

        <div className={appearAsNeutralButton} tabIndex={0} role="button" {...pressProps}>
          {stateWizardForm.dataDeployToken !== null ? "Next" : "Skip"}
        </div>
      </div>
    </form>
  );
};

export default Form;
