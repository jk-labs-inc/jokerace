import { useNetwork, useConnect } from "wagmi";
import { usePress } from "@react-aria/interactions";
import Button from "@components/Button";
import button from "@components/Button/styles";
// import { schema } from "./schema";
import FormField from "@components/FormField";
import FormInput from "@components/FormInput";
import FormTextarea from "@components/FormTextarea";
import { useStore } from "../store";

export const Form = props => {
  const { isDeploying, form, data, errors, isValid, interacted, setData } = props;
  const { isConnected } = useConnect();
  const { activeChain } = useNetwork();
  const stateWizardForm = useStore();

  const { pressProps } = usePress({
    onPress: () => stateWizardForm.setCurrentStep(4),
  });

  return (
    <form ref={form} className="w-full">
      <fieldset>
        <legend className="uppercase font-bold">The basics</legend>
        <div className="space-y-6">
          <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label hasError={errors().contestTitle?.length > 0 === true} htmlFor="contestTitle">
                Contest title
              </FormField.Label>
              <FormField.Description id="input-contesttile-description">
                The title of your contest
              </FormField.Description>
              <FormInput
                required
                disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
                aria-invalid={errors().contestTitle?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full"
                placeholder="What's your contest title ?"
                type="text"
                name="contestTitle"
                id="contestTitle"
                hasError={errors().contestTitle?.length > 0 === true}
                aria-describedby="input-contesttile-description input-contesttile-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock hasError={errors().contestTitle?.length > 0 === true} id="input-contesttile-helpblock">
              Your contest title can't be empty
            </FormField.HelpBlock>
          </FormField>

          <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label hasError={errors().contestDescription?.length > 0 === true} htmlFor="contestDescription">
                Contest description
              </FormField.Label>
              <FormField.Description id="input-contestdescription-description">
                The title of your contest
              </FormField.Description>
              <FormTextarea
                required
                disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
                aria-invalid={errors().contestDescription?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full"
                placeholder="What's your prompt"
                name="contestDescription"
                id="contestDescription"
                hasError={errors().contestDescription?.length > 0 === true}
                aria-describedby="input-contestdescription-description input-contestdescription-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock
              hasError={errors().contestDescription?.length > 0 === true}
              id="input-contestdescription-helpblock"
            >
              Please add a description to your contest.
            </FormField.HelpBlock>
          </FormField>

          <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label hasError={errors().votingTokenAddress?.length > 0 === true} htmlFor="votingTokenAddress">
                Voting token address{" "}
              </FormField.Label>
              <FormField.Description id="input-votingtokenaddress-description">
                The Ethereum address of the voting token
              </FormField.Description>
              <FormInput
                required
                disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
                aria-invalid={errors().votingTokenAddress?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full"
                placeholder="mywallet.eth"
                type="text"
                name="votingTokenAddress"
                id="votingTokenAddress"
                hasError={errors().votingTokenAddress?.length > 0 === true}
                aria-describedby="input-votingtokenaddress-description input-votingtokenaddress-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock
              hasError={errors().votingTokenAddress?.length > 0 === true}
              id="input-votingtokenaddress-helpblock"
            >
              Please type a valid Ethereum address f.
            </FormField.HelpBlock>
          </FormField>
        </div>
      </fieldset>

      <fieldset className="my-6">
        <legend className="uppercase font-bold">Submissions</legend>
        <div className="space-y-6"></div>
      </fieldset>

      <fieldset>
        <legend className="uppercase font-bold">Voting</legend>
        <div className="space-y-6"></div>
      </fieldset>
      <div className="pt-2 flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
        <Button
          isLoading={isDeploying === true}
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
          Create contest
        </Button>

        <div className={button({ intent: "neutral-outline" })} tabIndex={0} role="button" {...pressProps}>
          {stateWizardForm.dataDeployToken !== null ? "Next" : "Skip"}
        </div>
      </div>
    </form>
  );
};

export default Form;
