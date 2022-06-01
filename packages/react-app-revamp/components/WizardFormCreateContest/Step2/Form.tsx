import { useForm } from "@felte/react";
import { validator } from "@felte/validator-zod";
import { Switch } from "@headlessui/react";
import FormField from "@components/FormField";
import FormInput from "@components/FormInput";
import { schema } from "./schema";
import Button from "@components/Button";
import { useStore } from "../store";

export const Form = () => {
  const stateWizardForm = useStore();
  const { form, data, errors, isValid, isValidating, interacted, isDirty, setData } = useForm({
    extend: validator({ schema }),
    onSubmit: values => {
      console.log(values);
    },
  });
  return (
    <>
      <form ref={form}>
        <fieldset className="space-y-6">
          <FormField>
            <FormField.InputField>
              <FormField.Label hasError={errors().tokenName?.length > 0 === true} htmlFor="tokenName">
                Token name <span className="text-2xs text-neutral-10 pis-1">(max. 30 characters)</span>
              </FormField.Label>
              <FormField.Description id="input-tokenname-description">The name of your token</FormField.Description>
              <FormInput
                required
                aria-invalid={errors().tokenName?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full lg:w-3/4"
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

          <FormField>
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
                  aria-invalid={errors().tokenSymbol?.length > 0 === true ? "true" : "false"}
                  className="pis-9 max-w-full w-auto 2xs:w-full lg:w-3/4"
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
              Please type a token name that is at most 10 characters.
            </FormField.HelpBlock>
          </FormField>

          <FormField>
            <FormField.InputField>
              <FormField.Label hasError={errors().receivingAddress?.length > 0 === true} htmlFor="receivingAddress">
                Receiving address{" "}
                <span className="text-2xs text-neutral-10 pis-1">(Ethereum address or ENS address)</span>
              </FormField.Label>
              <FormField.Description id="input-receivingaddress-description">
                The name of your token
              </FormField.Description>
              <FormInput
                required
                aria-invalid={errors().receivingAddress?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full lg:w-3/4"
                placeholder="mywallet.eth"
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
              Please type a valid Ethereum address or a valid ENS address.
            </FormField.HelpBlock>
          </FormField>

          <FormField>
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
                aria-invalid={errors().numberOfTokens?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full lg:w-3/4"
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
          <Switch.Group>
            <div className="flex flex-col">
              <div className="flex items-center">
                <Switch.Label className="flex flex-col font-bold text-sm">
                  <span className="pie-2">Non-transferrable</span>
                </Switch.Label>
                <Switch
                  checked={data().nonTransferable}
                  onChange={e => setData("nonTransferable", e)}
                  name="nonTransferable"
                  className={`${
                    data().nonTransferable
                      ? "bg-positive-11 focus-visible:ring-positive-9 focus-visible:ring-opacity-25"
                      : "focus-visible:ring-true-white bg-neutral-7 focus-visible:ring-opacity-30"
                  }
          relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-4  border-2 border-transparent`}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      data().nonTransferable ? "translate-x-7" : "translate-x-0"
                    } pointer-events-none inline-block h-6 w-6 transform rounded-full bg-true-white shadow-lg transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
              <span className="text-neutral-11 pt-1 text-2xs">
                (if selected, only you will be able to <br />
                transfer the tokens)
              </span>
            </div>
          </Switch.Group>

          <div className="pt-4 flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
            <Button intent="neutral-oultine" disabled={isValid() === false || interacted() === null} type="submit">
              Mint
            </Button>

            <Button intent="neutral-oultine" onClick={() => stateWizardForm.setCurrentStep(3)}>
              Skip
            </Button>
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default Form;
