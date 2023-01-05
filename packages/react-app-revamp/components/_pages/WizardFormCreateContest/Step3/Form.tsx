import { useNetwork, useAccount, useToken } from "wagmi";
import { usePress } from "@react-aria/interactions";
import shallow from "zustand/shallow";
import Button from "@components/Button";
import button from "@components/Button/styles";
import FormField from "@components/FormField";
import FormInput from "@components/FormInput";
import FormTextarea from "@components/FormTextarea";
import { useStore } from "../store";
import { isAfter, isBefore, isFuture } from "date-fns";
import { RadioGroup } from "@headlessui/react";
import FormRadioOption from "@components/FormRadioOption";
import FormRadioGroup from "@components/FormRadioGroup";
import ToggleSwitch from "@components/ToggleSwitch";
import { useId } from "react";
import { CheckIcon, ExclamationIcon, PlusIcon, ShieldExclamationIcon, TrashIcon } from "@heroicons/react/outline";
import ordinalize from "@helpers/ordinalize";
interface FormProps {
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
}

const ranks = [1, 2, 3, 4, 5];

export const Form = (props: FormProps) => {
  const formId = useId();
  const { isDeploying, form, touched, data, errors, isValid, interacted, resetField, setData } = props;
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { setCurrentStep, setModalDeploySubmissionTokenOpen } = useStore(
    state => ({
      //@ts-ignore
      setCurrentStep: state.setCurrentStep,
      //@ts-ignore
      setModalDeploySubmissionTokenOpen: state.setModalDeploySubmissionTokenOpen,
      //@ts-ignore
      dataDeploySubmissionToken: state.dataDeploySubmissionToken,
    }),
    shallow,
  );

  const isDateOpeningSubmissionsValid = data()?.datetimeOpeningSubmissions;
  const isDateOpeningVotesValid =
    isDateOpeningSubmissionsValid && data()?.datetimeOpeningVoting
      ? isAfter(new Date(data().datetimeOpeningVoting), new Date(data().datetimeOpeningSubmissions))
      : false;
  const isDateClosingVotesValid =
    isDateOpeningVotesValid && data()?.datetimeClosingVoting
      ? isAfter(new Date(data().datetimeClosingVoting), new Date(data().datetimeOpeningVoting))
      : false;
  const isDateUsersQualifyToVoteAtAnotherValid =
    data()?.usersQualifyToVoteIfTheyHoldTokenOnVoteStart === true
      ? true
      : data().datetimeOpeningVoting &&
        isDateOpeningVotesValid &&
        data()?.usersQualifyToVoteAtAnotherDatetime &&
        isAfter(new Date(data()?.usersQualifyToVoteAtAnotherDatetime), new Date(data().datetimeOpeningVoting)) &&
        isBefore(new Date(data()?.usersQualifyToVoteAtAnotherDatetime), new Date(data().datetimeClosingVoting));
  const isRequiredNumberOfTokenToSubmitValid = data()?.submissionOpenToAll
    ? true
    : data()?.submissionOpenToAll === false &&
      data()?.requiredNumberOfTokenToSubmit &&
      !errors().requiredNumberOfTokenToSubmit?.length
    ? true
    : false;
  const isSubmissionNumberLimitValid = data()?.noSubmissionLimitPerUser
    ? true
    : data()?.noSubmissionLimitPerUser === false &&
      data()?.submissionPerUserMaxNumber &&
      !errors().submissionPerUserMaxNumber?.length
    ? true
    : false;

  const { pressProps } = usePress({
    onPress: () => setCurrentStep(4),
  });

  const erc20TokenRewards = useToken({
    address: data()?.rewardTokenAddress,
    enabled: data()?.rewardsType === "erc20" && data()?.rewardTokenAddress && data()?.rewardTokenAddress !== "",
  });

  return (
    <form ref={form} id={formId} className="w-full">
      <fieldset>
        <legend
          className={`text-neutral-12 uppercase font-bold tracking-wider text-md mb-3 ${
            !isConnected || chain?.unsupported === true || isDeploying === true ? "text-opacity-50" : ""
          }`}
        >
          The basics
        </legend>
        <div className="space-y-6">
          <FormField disabled={!isConnected || chain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label hasError={errors().contestTitle?.length > 0 === true} htmlFor="contestTitle">
                Contest title
              </FormField.Label>
              <FormField.Description id="input-contesttile-description">
                The title of your contest
              </FormField.Description>
              <FormInput
                required
                disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
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
              Your contest title can&apos;t be empty
            </FormField.HelpBlock>
          </FormField>

          <FormField disabled={!isConnected || chain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label hasError={errors().contestDescription?.length > 0 === true} htmlFor="contestDescription">
                Contest description
              </FormField.Label>
              <FormField.Description id="input-contestdescription-description">
                The description of your contest
              </FormField.Description>
              <FormTextarea
                required
                disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                aria-invalid={errors().contestDescription?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full min-h-[20ch]"
                placeholder="What's your prompt ?"
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

          <FormField disabled={!isConnected || chain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label hasError={errors().votingTokenAddress?.length > 0 === true} htmlFor="votingTokenAddress">
                Voting token address
              </FormField.Label>
              <FormField.Description id="input-votingtokenaddress-description">
                The Ethereum address of your voting token
              </FormField.Description>
              <FormInput
                required
                disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                aria-invalid={errors().votingTokenAddress?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full"
                placeholder="0x..."
                type="text"
                name="votingTokenAddress"
                id="votingTokenAddress"
                hasError={errors().votingTokenAddress?.length > 0 === true}
                aria-describedby="input-votingtokenaddress-description input-votingtokenaddress-helpblock input-votingtokenaddress-note"
              />
            </FormField.InputField>
            <p
              id="input-votingtokenaddress-note"
              className="text-2xs pt-2 text-secondary-11 pis-1 flex flex-wrap items-center"
            >
              <ShieldExclamationIcon className="text-secondary-11 mie-1ex w-5" />
              The token must be minted on our platform or implement the &nbsp;
              <span className="font-mono normal-case">IERC20VotesTimestamp</span>&nbsp; interface
            </p>
            <FormField.HelpBlock
              hasError={errors().votingTokenAddress?.length > 0 === true}
              id="input-votingtokenaddress-helpblock"
            >
              Please type a valid Ethereum address.
            </FormField.HelpBlock>
          </FormField>
        </div>
      </fieldset>

      <fieldset className="mt-12">
        <legend
          className={`text-neutral-12 uppercase font-bold tracking-wider text-md mb-3 ${
            !isConnected || chain?.unsupported === true || isDeploying === true ? "text-opacity-50" : ""
          }`}
        >
          Submissions
        </legend>
        <div className="space-y-6">
          <FormField disabled={!isConnected || chain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label
                hasError={errors().datetimeOpeningSubmissions?.length > 0 === true || !isDateOpeningSubmissionsValid}
                htmlFor="datetimeOpeningSubmissions"
              >
                Submissions open{" "}
              </FormField.Label>
              <FormField.Description id="input-datetimeopeningsubmissions-description">
                The date and time from which users can start sending their submissions
              </FormField.Description>
              <FormInput
                required
                disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                aria-invalid={
                  errors().datetimeOpeningSubmissions?.length > 0 === true || !isDateOpeningSubmissionsValid
                    ? "true"
                    : "false"
                }
                className="xs:max-w-fit-content w-full"
                type="datetime-local"
                name="datetimeOpeningSubmissions"
                min={new Date().toISOString().substring(0, 16)}
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                id="datetimeOpeningSubmissions"
                hasError={errors().datetimeOpeningSubmissions?.length > 0 === true || !isDateOpeningSubmissionsValid}
                aria-describedby="input-datetimeopeningsubmissions-description input-datetimeopeningsubmissions-helpblock-1 input-datetimeopeningsubmissions-helpblock-2"
              />
            </FormField.InputField>
            <FormField.HelpBlock
              hasError={false}
              id="input-datetimeopeningsubmissions-helpblock-1"
              className="min:not-sr-only text-2xs text-neutral-11"
            >
              Timezone: ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </FormField.HelpBlock>

            <FormField.HelpBlock
              hasError={errors().datetimeOpeningSubmissions?.length > 0 === true || !isDateOpeningSubmissionsValid}
              id="input-datetimeopeningsubmissions-helpblock-2"
            >
              Please type a valid date.
            </FormField.HelpBlock>
          </FormField>

          <FormField disabled={!isConnected || chain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label
                className="flex flex-wrap"
                hasError={errors().submissionMaxNumber?.length > 0 === true}
                htmlFor="submissionMaxNumber"
              >
                Maximum number of submissions in contest{" "}
                <span className="text-2xs text-neutral-10 pis-1">(recommended: 200 submissions max)</span>
              </FormField.Label>
              <FormField.Description id="input-numberoftokens-description">
                The maximum number of submissions your contest will show
              </FormField.Description>
              <FormInput
                required
                disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                aria-invalid={errors().submissionMaxNumber?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full"
                placeholder="200"
                type="number"
                name="submissionMaxNumber"
                id="submissionMaxNumber"
                min={1}
                step={1}
                hasError={errors().submissionMaxNumber?.length > 0 === true}
                aria-describedby="input-submissionmaxnumber-description input-submissionmaxnumber-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock
              hasError={errors().submissionMaxNumber?.length > 0 === true}
              id="input-submissionmaxnumber-helpblock"
            >
              Please type a positive number.
            </FormField.HelpBlock>
          </FormField>

          <FormRadioGroup
            disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
            value={data()?.whoCanSubmit}
            onChange={(e: string) => {
              setData("whoCanSubmit", e);
              setData("submissionOpenToAll", e === "anybody");
              resetField("requiredNumberOfTokenToSubmit");
            }}
          >
            <RadioGroup.Label className="sr-only">Can anybody send submission to your contest ?</RadioGroup.Label>
            <FormRadioOption value="anybody">
              Anybody can submit a proposal <span className="text-2xs pis-1ex text-neutral-10">(recommended)</span>
            </FormRadioOption>
            <FormRadioOption value="mustHaveVotingTokens">
              <>
                Must have{" "}
                <FormInput
                  disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                  aria-invalid={
                    touched()?.requiredNumberOfTokenToSubmit &&
                    data()?.whoCanSubmit === "mustHaveVotingTokens" &&
                    !isRequiredNumberOfTokenToSubmitValid
                      ? "true"
                      : "false"
                  }
                  placeholder="200"
                  required={data()?.whoCanSubmit === "mustHaveVotingTokens"}
                  className="mx-2 max-w-auto w-[12ex]"
                  scale="sm"
                  type="number"
                  name="requiredNumberOfTokenToSubmit"
                  min={0.00000001}
                  step={0.00000001}
                  hasError={
                    touched()?.requiredNumberOfTokenToSubmit &&
                    data()?.whoCanSubmit === "mustHaveVotingTokens" &&
                    !isRequiredNumberOfTokenToSubmitValid
                  }
                  aria-describedby="input-requirednumberoftoken-voting-helpblock"
                />{" "}
                voting token(s) to submit a proposal
              </>
              <FormField.HelpBlock
                className="!mt-1"
                hasError={
                  touched()?.requiredNumberOfTokenToSubmit &&
                  data()?.whoCanSubmit === "mustHaveVotingTokens" &&
                  !isRequiredNumberOfTokenToSubmitValid
                }
                id="input-requirednumberoftoken-voting-helpblock"
              >
                Type a positive number to specify the required number of tokens.
              </FormField.HelpBlock>
            </FormRadioOption>
            <FormRadioOption value="mustHaveSubmissionTokens">
              <>
                Must have{" "}
                <FormInput
                  disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                  aria-invalid={
                    touched()?.requiredNumberOfTokenToSubmit &&
                    data()?.whoCanSubmit === "mustHaveSubmissionTokens" &&
                    !isRequiredNumberOfTokenToSubmitValid
                      ? "true"
                      : "false"
                  }
                  placeholder="200"
                  required={data()?.whoCanSubmit === "mustHaveSubmissionTokens"}
                  className="mx-2 max-w-auto w-[12ex]"
                  scale="sm"
                  type="number"
                  name="requiredNumberOfTokenToSubmit"
                  min={0.00000001}
                  step={0.00000001}
                  hasError={
                    touched()?.requiredNumberOfTokenToSubmit &&
                    data()?.whoCanSubmit === "mustHaveSubmissionTokens" &&
                    !isRequiredNumberOfTokenToSubmitValid
                  }
                  aria-describedby="input-requirednumberoftoken-submissions-helpblock"
                />{" "}
                submission token(s) to submit a proposal
              </>
              <FormField.HelpBlock
                className="!mt-1"
                hasError={
                  touched()?.requiredNumberOfTokenToSubmit &&
                  data()?.whoCanSubmit === "mustHaveSubmissionTokens" &&
                  !isRequiredNumberOfTokenToSubmitValid
                }
                id="input-requirednumberoftoken-submissions-helpblock"
              >
                Type a positive number to specify the required number of tokens.
              </FormField.HelpBlock>
            </FormRadioOption>
          </FormRadioGroup>
          <div
            className={`${
              data()?.whoCanSubmit !== "mustHaveSubmissionTokens" ? "pointer-events-none opacity-75" : ""
            } xs:pis-6 text-sm !mt-0.5 flex items-center flex-wrap`}
          >
            <span className="pie-1ex">Address of the submission token:</span>
            <div className="flex-grow py-1">
              <FormInput
                disabled={
                  data()?.whoCanSubmit !== "mustHaveSubmissionTokens" ||
                  !isConnected ||
                  chain?.unsupported === true ||
                  isDeploying === true
                }
                aria-invalid={
                  data()?.whoCanSubmit === "mustHaveSubmissionTokens" &&
                  touched()?.submissionTokenAddress &&
                  (!data()?.submissionTokenAddress || data()?.submissionTokenAddress === "")
                    ? "true"
                    : "false"
                }
                value={data()?.whoCanSubmit !== "mustHaveSubmissionTokens" ? "" : data()?.submissionTokenAddress}
                required={data()?.whoCanSubmit === "mustHaveSubmissionTokens"}
                className="w-full"
                placeholder="0x..."
                scale="sm"
                name="submissionTokenAddress"
                id="submissionTokenAddress"
                hasError={
                  data()?.whoCanSubmit === "mustHaveSubmissionTokens" &&
                  touched()?.submissionTokenAddress &&
                  (!data()?.submissionTokenAddress || data()?.submissionTokenAddress === "")
                }
                aria-describedby={`input-submissionTokenAddress-helpblock ${
                  data()?.whoCanSubmit === "mustHaveSubmissionTokens" ? "input-submissionTokenAddress-note" : ""
                }`}
              />
              {data()?.whoCanSubmit === "mustHaveSubmissionTokens" && (
                <p
                  id="input-submissionTokenAddress-note"
                  className="text-2xs pt-2 font-normal text-secondary-11 pis-1 flex flex-wrap items-center"
                >
                  <ShieldExclamationIcon className="text-secondary-11 mie-1ex w-5" />
                  The token must be minted on our platform or implement the &nbsp;
                  <span className="font-mono normal-case">IERC20VotesTimestamp</span>&nbsp; interface
                </p>
              )}
              <FormField.HelpBlock
                hasError={
                  errors().submissionTokenAddress?.length > 0 === true ||
                  (data()?.whoCanSubmit === "mustHaveSubmissionTokens" &&
                    touched()?.submissionTokenAddress &&
                    (!data()?.submissionTokenAddress || data()?.submissionTokenAddress === ""))
                }
                id="input-submissionTokenAddress-helpblock"
              >
                Please type a valid Ethereum address.
              </FormField.HelpBlock>
            </div>
            <div className="flex items-center w-full pt-1">
              <span className="text-neutral-11 pie-1ex">Or&nbsp;</span>
              <Button
                onClick={() => setModalDeploySubmissionTokenOpen(true)}
                disabled={
                  data()?.whoCanSubmit !== "mustHaveSubmissionTokens" ||
                  !isConnected ||
                  chain?.unsupported === true ||
                  isDeploying === true
                }
                className="w-full 2xs:w-fit-content"
                type="button"
                scale="xs"
              >
                Mint new token
              </Button>
            </div>
          </div>
          <FormRadioGroup
            disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
            value={data()?.noSubmissionLimitPerUser}
            onChange={(e: boolean) => {
              if (e === true) {
                resetField("submissionPerUserMaxNumber");
              }
              setData("noSubmissionLimitPerUser", e);
            }}
          >
            <RadioGroup.Label className="sr-only">Is there any limit on submissions per wallet ?</RadioGroup.Label>

            <FormRadioOption value={false}>
              <>
                Each submitters can submit up to{" "}
                <FormInput
                  disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                  aria-invalid={
                    touched()?.submissionPerUserMaxNumber && !isSubmissionNumberLimitValid ? "true" : "false"
                  }
                  placeholder="1"
                  className="mx-2 max-w-auto w-[12ex]"
                  scale="sm"
                  type="number"
                  name="submissionPerUserMaxNumber"
                  id="submissionPerUserMaxNumber"
                  min={1}
                  step={1}
                  hasError={touched()?.submissionPerUserMaxNumber && !isSubmissionNumberLimitValid}
                  aria-describedby="input-submissionperusermaxnumber-helpblock"
                />{" "}
                entr{data()?.submissionPerUserMaxNumber > 1 ? "ies" : "y"}{" "}
                <span className="text-2xs pis-1ex text-neutral-10">(recommended: 1 entry)</span>
              </>
            </FormRadioOption>
            <FormField.HelpBlock
              className="!mt-1"
              hasError={touched()?.submissionPerUserMaxNumber && !isSubmissionNumberLimitValid}
              id="input-submissionperusermaxnumber-helpblock"
            >
              Type a positive number to specify the maximum number of submissions.
            </FormField.HelpBlock>

            <FormRadioOption value={true}>No limit on submissions per wallet</FormRadioOption>
          </FormRadioGroup>
        </div>
      </fieldset>

      <fieldset className="mt-12">
        <legend
          className={`text-neutral-12 uppercase font-bold tracking-wider text-md mb-3 ${
            !isConnected || chain?.unsupported === true || isDeploying === true ? "text-opacity-50" : ""
          }`}
        >
          Voting
        </legend>
        <div className="space-y-6">
          <FormField
            disabled={
              !isDateOpeningSubmissionsValid || !isConnected || chain?.unsupported === true || isDeploying === true
            }
          >
            <FormField.InputField>
              <FormField.Label
                hasError={
                  errors().datetimeOpeningVoting?.length > 0 === true ||
                  (data()?.datetimeOpeningVoting && !isDateOpeningVotesValid)
                }
                htmlFor="datetimeOpeningVoting"
              >
                Voting opens <span className="text-2xs text-neutral-10 pis-1">(and submissions close)</span>
              </FormField.Label>
              <FormField.Description id="input-datetimeopeningvoting-description">
                The date and time from which users can start voting
              </FormField.Description>
              <FormInput
                required
                disabled={
                  !data()?.datetimeOpeningSubmissions ||
                  !isConnected ||
                  chain?.unsupported === true ||
                  isDeploying === true
                }
                aria-invalid={
                  errors().datetimeOpeningVoting?.length > 0 === true ||
                  (data()?.datetimeOpeningVoting && !isDateOpeningVotesValid)
                    ? "true"
                    : "false"
                }
                className="xs:max-w-fit-content w-full"
                type="datetime-local"
                name="datetimeOpeningVoting"
                min={
                  isFuture(new Date(data()?.datetimeOpeningSubmissions))
                    ? data()?.datetimeOpeningSubmissions
                    : new Date().toISOString()
                }
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                id="datetimeOpeningVoting"
                hasError={
                  errors().datetimeOpeningVoting?.length > 0 === true ||
                  (data()?.datetimeOpeningVoting && !isDateOpeningVotesValid)
                }
                aria-describedby="input-datetimeopeningvoting-description input-datetimeopeningvoting-helpblock-1 input-datetimeopeningvoting-helpblock-2"
              />
            </FormField.InputField>
            <FormField.HelpBlock
              hasError={false}
              id="put-datetimeopeningvoting-helpblock-1"
              className="min:not-sr-only text-2xs text-neutral-11"
            >
              Timezone: ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </FormField.HelpBlock>
            <FormField.HelpBlock
              hasError={
                errors().datetimeOpeningVoting?.length > 0 === true ||
                (data()?.datetimeOpeningVoting && !isDateOpeningVotesValid)
              }
              id="input-datetimeopeningvoting-helpblock-2"
            >
              The opening date for votes must be{" "}
              <span className="font-bold">after the opening date for submissions and can&apos;t be in the past.</span>.
            </FormField.HelpBlock>
          </FormField>

          <FormField
            disabled={!isDateOpeningVotesValid || !isConnected || chain?.unsupported === true || isDeploying === true}
          >
            <FormField.InputField>
              <FormField.Label
                hasError={
                  errors().datetimeClosingVoting?.length > 0 === true ||
                  (data()?.datetimeClosingVoting && !isDateClosingVotesValid)
                }
                htmlFor="datetimeClosingVoting"
              >
                Voting closes <span className="text-2xs text-neutral-10 pis-1">(and contest closes)</span>
              </FormField.Label>
              <FormField.Description id="input-datetimeclosesvoting-description">
                The date and time on which users won&apos;t be able to vote anymore
              </FormField.Description>
              <div className="flex">
                <FormInput
                  required
                  disabled={
                    !data()?.datetimeOpeningSubmissions ||
                    !data()?.datetimeOpeningVoting ||
                    !isConnected ||
                    chain?.unsupported === true ||
                    isDeploying === true
                  }
                  aria-invalid={
                    errors().datetimeClosingVoting?.length > 0 ||
                    (data()?.datetimeClosingVoting && !isDateClosingVotesValid) === true
                      ? "true"
                      : "false"
                  }
                  className="xs:max-w-fit-content w-full"
                  type="datetime-local"
                  name="datetimeClosingVoting"
                  min={data()?.datetimeOpeningVoting}
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                  id="datetimeClosingVoting"
                  hasError={
                    errors().datetimeClosingVoting?.length > 0 === true ||
                    (data()?.datetimeClosingVoting && !isDateClosingVotesValid)
                  }
                  aria-describedby="input-datetimeclosesvoting-description input-datetimeclosesvoting-helpblock-1 input-datetimeclosesvoting-helpblock-2"
                />
              </div>
            </FormField.InputField>
            <FormField.HelpBlock
              hasError={false}
              id="input-datetimeclosesvoting-helpblock-1"
              className="min:not-sr-only text-2xs text-neutral-11"
            >
              Timezone: ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </FormField.HelpBlock>
            <FormField.HelpBlock
              hasError={
                errors().datetimeClosingVoting?.length > 0 === true ||
                (data()?.datetimeClosingVoting && !isDateClosingVotesValid)
              }
              id="input-datetimeclosesvoting-helpblock-2"
            >
              The closes date for votes must be{" "}
              <span className="font-bold">after the opening date for votes and can&apos;t be in the past</span>.
            </FormField.HelpBlock>
          </FormField>

          <FormRadioGroup
            disabled={!isDateClosingVotesValid || !isConnected || chain?.unsupported === true || isDeploying === true}
            value={data()?.usersQualifyToVoteIfTheyHoldTokenOnVoteStart}
            onChange={(e: boolean) => {
              if (e === true) {
                resetField("usersQualifyToVoteAtAnotherDatetime");
              }
              setData("usersQualifyToVoteIfTheyHoldTokenOnVoteStart", e);
            }}
          >
            <RadioGroup.Label className="sr-only">When do users qualify to vote ?</RadioGroup.Label>

            <FormRadioOption value={true}>
              <>
                Submitters qualify to vote if they hold tokens at start of voting{" "}
                <span className="text-2xs pis-1ex text-neutral-10">(recommended)</span>
              </>
            </FormRadioOption>

            <FormRadioOption
              classNameCheckbox="mt-2"
              classNameWrapper="min:items-start"
              className="min:items-start flex-col"
              value={false}
            >
              Submitters qualify to vote at another set time
            </FormRadioOption>
          </FormRadioGroup>
          <FormField
            className="pis-5 !mt-0"
            disabled={
              !isDateClosingVotesValid ||
              data()?.usersQualifyToVoteIfTheyHoldTokenOnVoteStart !== false ||
              !isConnected ||
              chain?.unsupported === true ||
              isDeploying === true
            }
          >
            <FormField.InputField>
              <FormField.Label
                className="sr-only"
                hasError={
                  errors().usersQualifyToVoteAtAnotherDatetime?.length > 0 === true ||
                  (data()?.usersQualifyToVoteAtAnotherDatetime && !isDateUsersQualifyToVoteAtAnotherValid)
                }
                htmlFor="usersQualifyToVoteAtAnotherDatetime"
              >
                Users can vote from date
              </FormField.Label>
              <FormField.Description id="input-datetimeopeningvoting-description">
                A date and time from which users that can send submissions can start voting
              </FormField.Description>
              <FormInput
                required
                scale="sm"
                disabled={
                  !isDateClosingVotesValid ||
                  data()?.usersQualifyToVoteIfTheyHoldTokenOnVoteStart !== false ||
                  !isConnected ||
                  chain?.unsupported === true ||
                  isDeploying === true
                }
                aria-invalid={
                  errors().usersQualifyToVoteAtAnotherDatetime?.length > 0 === true ||
                  (data()?.usersQualifyToVoteAtAnotherDatetime && !isDateUsersQualifyToVoteAtAnotherValid)
                    ? "true"
                    : "false"
                }
                className="mt-2 xs:max-w-fit-content w-full"
                type="datetime-local"
                name="usersQualifyToVoteAtAnotherDatetime"
                max={data()?.datetimeClosingVoting}
                pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                id="usersQualifyToVoteAtAnotherDatetime"
                hasError={
                  errors().usersQualifyToVoteAtAnotherDatetime?.length > 0 === true ||
                  (data()?.usersQualifyToVoteAtAnotherDatetime && !isDateUsersQualifyToVoteAtAnotherValid)
                }
                aria-describedby="input-usersqualifytovoteatanotherdatetime-description input-usersqualifytovoteatanotherdatetime-helpblock-1 input-usersqualifytovoteatanotherdatetime-helpblock-2"
              />
            </FormField.InputField>
            <FormField.HelpBlock
              hasError={false}
              id="put-usersqualifytovoteatanotherdatetime-helpblock-1"
              className="min:not-sr-only text-2xs text-neutral-11"
            >
              Timezone: ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </FormField.HelpBlock>
            <FormField.HelpBlock
              hasError={
                errors().usersQualifyToVoteAtAnotherDatetime?.length > 0 === true ||
                (data()?.usersQualifyToVoteAtAnotherDatetime && !isDateUsersQualifyToVoteAtAnotherValid)
              }
              id="input-usersqualifytovoteatanotherdatetime-helpblock-2"
            >
              The opening date for votes must be{" "}
              <span className="font-bold">
                after the closing date for submissions and before the closing date for votes.{" "}
              </span>
            </FormField.HelpBlock>
          </FormField>

          <FormField disabled={!isConnected || chain?.unsupported === true || isDeploying === true}>
            <ToggleSwitch
              label="Downvoting"
              disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
              checked={data().downvotingAllowed}
              onChange={(e: boolean) => {
                setData("downvotingAllowed", e);
              }}
            />
          </FormField>
        </div>
      </fieldset>

      <fieldset className="my-12">
        <legend
          className={`text-neutral-12 uppercase font-bold tracking-wider text-md mb-3 ${
            !isConnected || chain?.unsupported === true || isDeploying === true ? "text-opacity-50" : ""
          }`}
        >
          Rewards
        </legend>
        <div className="space-y-6">
          <FormRadioGroup
            disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
            value={data()?.rewardsType}
            onChange={(e: string) => {
              setData("rewardsType", e);
              resetField("rewardTokenAddress");
              resetField("rewards");
              if (e !== "noRewards") {
                setData("rewards", [
                  {
                    winningRank: 1,
                    rewardTokenAmount: 0,
                  },
                ]);
              }
            }}
          >
            <RadioGroup.Label className="sr-only">Does your contest have rewards ?</RadioGroup.Label>
            <FormRadioOption value={"noRewards"}>No rewards</FormRadioOption>
            <FormRadioOption value={"native"}>
              Reward&nbsp; <span className="uppercase">${chain?.nativeCurrency?.symbol}</span>
            </FormRadioOption>
            <FormRadioOption value={"erc20"}>Reward another token on {chain?.name}</FormRadioOption>
          </FormRadioGroup>
          {data()?.rewardsType !== "noRewards" && (
            <div className="!mt-3 animate-appear max-w-[90%] 2xs:max-w-unset flex flex-col space-y-6 xs:pis-6">
              {data()?.rewardsType === "erc20" && (
                <FormField disabled={!isConnected || chain?.unsupported === true || isDeploying === true}>
                  <FormField.InputField>
                    <FormField.Label
                      className="text-sm"
                      hasError={errors().rewardTokenAddress?.length > 0 === true}
                      htmlFor="rewardTokenAddress"
                    >
                      Token address:
                    </FormField.Label>
                    <FormField.Description id="input-rewardTokenAddress-description">
                      The Ethereum address of the ERC20 token you want to give as a reward.
                    </FormField.Description>

                    <FormInput
                      required
                      scale="sm"
                      disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                      aria-invalid={
                        errors().rewardTokenAddress?.length > 0 === true || erc20TokenRewards?.isError
                          ? "true"
                          : "false"
                      }
                      className="max-w-full w-auto 2xs:w-full"
                      placeholder="0x..."
                      type="text"
                      name="rewardTokenAddress"
                      hasError={errors().rewardTokenAddress?.length > 0 === true || erc20TokenRewards?.isError}
                      aria-describedby="input-rewardTokenAddress-description input-rewardTokenAddress-note input-rewardTokenAddress-helpblock"
                    />
                  </FormField.InputField>
                  {erc20TokenRewards?.data && (
                    <div className="pt-2 flex items-center">
                      <CheckIcon className="mie-2 w-5 shrink-0 text-positive-11" />
                      <p className="text-neutral-11 text-2xs normal-case font-bold">
                        {erc20TokenRewards?.data?.name}{" "}
                        <span className="uppercase">(${erc20TokenRewards?.data?.symbol})</span>
                      </p>
                    </div>
                  )}
                  {erc20TokenRewards?.isError && (
                    <div className="pt-2 flex items-center">
                      <ExclamationIcon className="mie-2 w-5 shrink-0 text-negative-11" />
                      <p className="text-negative-11 text-2xs">{erc20TokenRewards?.error?.message}</p>{" "}
                    </div>
                  )}

                  {!erc20TokenRewards?.data && (
                    <p
                      id="input-rewardTokenAddress-note"
                      className="text-2xs pt-2 text-secondary-11 pis-1 flex flex-wrap items-center"
                    >
                      <ShieldExclamationIcon className="text-secondary-11 mie-1ex w-5" />
                      Must be a valid &nbsp;
                      <span className="font-mono normal-case">ERC20</span>&nbsp; token on {chain?.name}
                    </p>
                  )}
                  <FormField.HelpBlock
                    hasError={errors().rewardTokenAddress?.length > 0 === true}
                    id="input-rewardTokenAddress-helpblock"
                  >
                    The reward token address must be a valid Ethereum address
                  </FormField.HelpBlock>
                </FormField>
              )}
              {data()?.rewards.map((reward: any, i: number) => (
                <div
                  key={`reward-${reward.key}`}
                  className="text-sm p-4 border-neutral-4 border-solid border rounded-md space-y-6 relative"
                >
                  <FormField disabled={!isConnected || chain?.unsupported === true || isDeploying === true}>
                    <FormField.InputField>
                      <FormField.Label
                        className="text-sm"
                        hasError={errors().rewards?.[i]?.winningRank?.length > 0 === true}
                        htmlFor="rewardTokenAmount"
                      >
                        Winning rank that earns tokens:
                      </FormField.Label>
                      <FormField.Description id="input-winningRank-description">
                        The rank eligible to earn a reward
                      </FormField.Description>
                      <div className="relative flex">
                      <FormInput
                        required
                        scale="sm"
                        type="number"
                        step="1"
                        min={1}
                        disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                        aria-invalid={errors().rewards?.[i]?.winningRank?.length > 0 === true ? "true" : "false"}
                        className="max-w-full pie-12 w-auto 2xs:w-full"
                        placeholder="1"
                        value={
                          data()?.rewards.filter((rewardToDelete: any) => rewardToDelete.key === reward.key)[0]
                            ?.winningRank
                        }
                        
                        hasError={errors().rewards?.[i]?.winningRank?.length > 0 === true}
                        aria-describedby="input-winningRank-description input-winningRank-helpblock"
                        onChange={e => {
                          const rewards = data()?.rewards;
                          rewards[i].winningRank = parseInt(e.currentTarget.value);
                          setData("rewards", rewards);
                        }}
                      />
                      <span className="absolute w-10 inline-end-0 top-0 h-full bg-neutral-2 text-xs border border-neutral-4 rounded-ie-md  flex justify-center items-center text-neutral-11">{ordinalize(data()?.rewards[i].winningRank)?.suffix}</span>
                    </div>
                    </FormField.InputField>
                    <FormField.HelpBlock
                      hasError={errors().rewards?.[i]?.winningRank?.length > 0 === true}
                      id="input-winningRank-helpblock"
                    >
                      You must type a rank.
                    </FormField.HelpBlock>
                  </FormField>

                  <FormField disabled={!isConnected || chain?.unsupported === true || isDeploying === true}>
                    <FormField.InputField>
                      <FormField.Label
                        className="text-sm"
                        hasError={errors().rewards?.[i]?.rewardTokenAmount?.length > 0 === true}
                        htmlFor="rewardTokenAmount"
                      >
                        Number of tokens this rank wins:
                      </FormField.Label>
                      <FormField.Description id="input-rewardTokenAmount-description">
                        The amount of tokens you want to give as a reward.
                      </FormField.Description>
                      <FormInput
                        required
                        scale="sm"
                        disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                        aria-invalid={errors().rewards?.[i]?.rewardTokenAmount?.length > 0 === true ? "true" : "false"}
                        className="max-w-full w-auto 2xs:w-full"
                        placeholder="100"
                        type="number"
                        min={0.0000001}
                        step={0.0000001}
                        hasError={errors().rewards?.[i]?.rewardTokenAmount?.length > 0 === true}
                        aria-describedby="input-rewardTokenAmount-description input-rewardTokenAmount-helpblock"
                        onChange={e => {
                          const rewards = data()?.rewards;
                          rewards[i].rewardTokenAmount = parseFloat(e.currentTarget.value);
                          setData("rewards", rewards);
                        }}
                      />
                    </FormField.InputField>
                    <FormField.HelpBlock
                      hasError={errors().rewards?.[i]?.rewardTokenAmount?.length > 0 === true}
                      id="input-rewardTokenAmount-helpblock"
                    >
                      The reward amount must be a positive number.
                    </FormField.HelpBlock>
                  </FormField>

                  <Button
                    className="w-full xs:w-auto space-i-3"
                    scale="xs"
                    intent="ghost-negative"
                    type="button"
                    onClick={() => {
                      const updatedRewards = data()?.rewards.filter(
                        (rewardToDelete: any) => rewardToDelete.key !== reward.key,
                      );
                      setData("rewards", updatedRewards);
                      if (updatedRewards.length === 0) setData("rewardsType", "noRewards");
                    }}
                  >
                    <TrashIcon className="w-4" />
                    <span className="font-bold">Remove</span>
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => {
                  setData("rewards", [
                    ...data()?.rewards,
                    {
                      winningRank: ranks.filter(rank => {
                        const rewardRanks = data()?.rewards?.map((r: any) => r.winningRank);
                        return !rewardRanks.includes(rank);
                      })[0],
                      rewardTokenAmount: 0,
                    },
                  ]);
                }}
                intent="primary-outline"
                scale="sm"
                type="button"
                className="w-full mx-auto xs:mx-0 xs:w-fit-content mt-4"
              >
                <PlusIcon className="w-4 mie-2" />
                <span className="pie-2">Add another winning rank</span>
              </Button>
            </div>
          )}
          {["erc20", "native"].includes(data()?.rewardsType) &&
            data()?.rewards?.filter((reward: any) => isNaN(reward?.rewardTokenAmount))?.length === 0 && (
              <div className="max-w-[90%] 2xs:max-w-unset animate-appear xs:mis-6 border-t border-solid border-neutral-4 pt-6 mt-3">
                <p className="font-bold text-sm mb-2">
                  Total rewards:&nbsp;
                  <span className="text-primary-10 normal-case ">
                    {data()?.rewards.reduce((sumRewards: number, reward: any) => {
                      //@ts-ignore
                      return parseFloat(sumRewards ?? 0) + parseFloat(reward?.rewardTokenAmount ?? 0);
                    }, 0)}{" "}
                    {data()?.rewardsType === "erc20" && (
                      <>{erc20TokenRewards?.data?.symbol ? `$${erc20TokenRewards?.data?.symbol}` : "--"}</>
                    )}
                    {data()?.rewardsType === "native" && chain?.nativeCurrency?.symbol}
                  </span>
                </p>
                <ul className="list-disc pis-4">
                  {data()?.rewards.map((reward: any) => {
                    const totalRewardsAmount = data()?.rewards.reduce((sumRewards: number, reward: any) => {
                      return sumRewards + reward.rewardTokenAmount;
                    }, 0);
                    const rewardPercentage = isNaN(totalRewardsAmount)
                      ? 0
                      : ((reward.rewardTokenAmount / totalRewardsAmount) * 100).toFixed(2);
                    return (
                      <li className="animate-appear text-neutral-12 text-xs" key={`rank-distribution-${reward.key}`}>
                        Proposal with rank {reward.winningRank} will get {/* @ts-ignore */}
                        <span className="font-bold">~{isNaN(rewardPercentage) ? 0 : rewardPercentage}%</span> of the
                        rewards
                      </li>
                    );
                  })}
                </ul>
                <p className="text-neutral-11 mt-2.5 text-2xs">
                  Please note: in the case of ties, rewards will be canceled for all affected ranks and returned to your
                  account to handle manually.
                </p>
                <p className="mt-5 mb-1.5 text-neutral-11 text-xs">
                  In a moment, you’ll create a rewards pool to fund winners, proportionately to the % set above.
                </p>
                <p className="mb-1.5 text-neutral-11 text-xs">
                  After, you can fund the pool by sending it tokens (the pool&apos;s address is on the
                  &quot;rewards&quot; page).
                </p>
                <p className="text-neutral-11 text-xs">
                  Post-contest, anyone can *execute* the transaction on the contest &quot;rewards&quot; page.
                </p>
              </div>
            )}
        </div>
      </fieldset>
      <div className="pt-6 flex flex-col gap-8">
        <Button
          className="sm:w-fit-content"
          isLoading={isDeploying === true}
          //@ts-ignore
          disabled={
            !isValid() ||
            interacted() === null ||
            !isConnected ||
            chain?.unsupported === true ||
            isDeploying === true ||
            !isRequiredNumberOfTokenToSubmitValid ||
            !isSubmissionNumberLimitValid ||
            (data()?.datetimeClosingVoting && !isDateClosingVotesValid) ||
            (data()?.datetimeOpeningVoting && !isDateOpeningVotesValid) ||
            (data()?.whoCanSubmit === "mustHaveSubmissionTokens" && !data()?.submissionTokenAddress) ||
            (data()?.whoCanSubmit === "mustHaveSubmissionTokens" && data()?.submissionTokenAddress === "") ||
            (data()?.usersQualifyToVoteAtAnotherDatetime && !isDateUsersQualifyToVoteAtAnotherValid) ||
            (data()?.rewardsType === "erc20" && (!data()?.rewardTokenAddress || !erc20TokenRewards?.data?.name)) ||
            (data()?.rewardsType !== "noRewards" &&
              (data()?.rewards?.length === 0 ||
                data()?.rewards?.filter((r: any) => isNaN(r?.winningRank) || isNaN(r?.rewardTokenAmount))?.length > 0))
          }
          type="submit"
        >
          Create contest
        </Button>
        <div>
          <span className="text-2xs text-neutral-9 font-medium pie-1ex">or</span>
          <div
            className={button({ intent: "ghost-neutral", scale: "xs", class: "w-fit-content" })}
            tabIndex={0}
            role="button"
            {...pressProps}
          >
            Skip
          </div>
        </div>
      </div>
    </form>
  );
};

export default Form;
