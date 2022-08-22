import { useNetwork, useAccount } from "wagmi";
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
import { useEffect, useId } from "react";
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

export const Form = (props: FormProps) => {
  const formId = useId();
  const { isDeploying, form, touched, data, errors, isValid, interacted, resetField, setData } = props;
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { dataDeploySubmissionToken, setCurrentStep, setModalDeploySubmissionTokenOpen } = useStore(
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
                Voting token address{" "}
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
                aria-describedby="input-votingtokenaddress-description input-votingtokenaddress-helpblock"
              />
            </FormField.InputField>
            <FormField.HelpBlock
              hasError={errors().votingTokenAddress?.length > 0 === true}
              id="input-votingtokenaddress-helpblock"
            >
              Please type a valid Ethereum address.
            </FormField.HelpBlock>
          </FormField>
        </div>
      </fieldset>

      <fieldset className="my-12">
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
            value={data()?.useSameTokenForSubmissions}
            onChange={(e: boolean) => {
              if (e === true) {
                resetField("submissionTokenAddress");
              }
              setData("useSameTokenForSubmissions", e);
            }}
          >
            <RadioGroup.Label className="sr-only">
              Does your contest require a different token for submitting proposals and voting ?
            </RadioGroup.Label>
            <FormRadioOption value={true}>Use the same token for both submitting proposals and voting</FormRadioOption>
            <FormRadioOption value={false}>
              <div className="flex items-center flex-wrap">
                <span className="pie-1ex">Require separate submission token</span>
                <FormInput
                  disabled={
                    data()?.useSameTokenForSubmissions ||
                    !isConnected ||
                    chain?.unsupported === true ||
                    isDeploying === true
                  }
                  aria-invalid={
                    touched()?.submissionTokenAddress && !data()?.useSameTokenForSubmissions ? "true" : "false"
                  }
                  value={dataDeploySubmissionToken?.address}
                  required={data()?.useSameTokenForSubmissions === true}
                  className="max-w-full flex-grow"
                  placeholder="0x..."
                  scale="sm"
                  name="submissionTokenAddress"
                  id="submissionTokenAddress"
                  hasError={touched()?.submissionTokenAddress && !data()?.useSameTokenForSubmissions}
                  aria-describedby="input-useSameTokenForSubmissions-helpblock"
                />
                <div className="flex items-center w-full pt-1">
                  <span className="text-neutral-11 pie-1ex">Or&nbsp;</span>
                  <Button
                    onClick={() => setModalDeploySubmissionTokenOpen(true)}
                    disabled={
                      data()?.useSameTokenForSubmissions ||
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
            </FormRadioOption>
          </FormRadioGroup>

          <FormRadioGroup
            disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
            value={data()?.submissionOpenToAll}
            onChange={(e: boolean) => {
              if (e === true) {
                resetField("requiredNumberOfTokenToSubmit");
              }
              setData("submissionOpenToAll", e);
            }}
          >
            <RadioGroup.Label className="sr-only">Can anybody send submission to your contest ?</RadioGroup.Label>
            <FormRadioOption value={true}>
              Anybody can submit <span className="text-2xs pis-1ex text-neutral-10">(recommended)</span>
            </FormRadioOption>
            <FormRadioOption value={false}>
              <>
                Must have{" "}
                <FormInput
                  disabled={!isConnected || chain?.unsupported === true || isDeploying === true}
                  aria-invalid={
                    touched()?.requiredNumberOfTokenToSubmit && !isRequiredNumberOfTokenToSubmitValid ? "true" : "false"
                  }
                  placeholder="200"
                  required={data()?.submissionOpenToAll === false}
                  className="mx-2 max-w-auto w-[12ex]"
                  scale="sm"
                  type="number"
                  name="requiredNumberOfTokenToSubmit"
                  id="requiredNumberOfTokenToSubmit"
                  min={1}
                  step={1}
                  hasError={touched()?.requiredNumberOfTokenToSubmit && !isRequiredNumberOfTokenToSubmitValid}
                  aria-describedby="input-requirednumberoftoken-helpblock"
                />{" "}
                token(s) to submit
              </>
            </FormRadioOption>
          </FormRadioGroup>
          <FormField.HelpBlock
            className="!mt-1"
            hasError={touched()?.requiredNumberOfTokenToSubmit && !isRequiredNumberOfTokenToSubmitValid}
            id="input-requirednumberoftoken-helpblock"
          >
            Type a positive number to specify the required number of tokens.
          </FormField.HelpBlock>

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

      <fieldset>
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
      <div className="pt-6 flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
        <Button
          isLoading={isDeploying === true}
          //@ts-ignore
          intent="neutral-oultine"
          disabled={
            !isConnected ||
            chain?.unsupported === true ||
            isDeploying === true ||
            isValid() === false ||
            interacted() === null ||
            !isRequiredNumberOfTokenToSubmitValid ||
            !isSubmissionNumberLimitValid ||
            (data()?.datetimeClosingVoting && !isDateClosingVotesValid) ||
            (data()?.datetimeOpeningVoting && !isDateOpeningVotesValid) ||
            (data()?.usersQualifyToVoteAtAnotherDatetime && !isDateUsersQualifyToVoteAtAnotherValid)
          }
          type="submit"
        >
          Create contest
        </Button>

        <div className={button({ intent: "neutral-outline" })} tabIndex={0} role="button" {...pressProps}>
          Next
        </div>
      </div>
    </form>
  );
};

export default Form;
