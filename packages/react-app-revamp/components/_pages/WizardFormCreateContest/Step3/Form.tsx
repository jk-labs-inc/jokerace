import { useNetwork, useConnect } from "wagmi";
import { usePress } from "@react-aria/interactions";
import Button from "@components/Button";
import button from "@components/Button/styles";
import FormField from "@components/FormField";
import FormInput from "@components/FormInput";
import FormTextarea from "@components/FormTextarea";
import { useStore } from "../store";
import { isAfter, isBefore, isPast } from "date-fns";
import { RadioGroup } from "@headlessui/react";
import FormRadioOption from "@components/FormRadioOption";
import FormRadioGroup from "@components/FormRadioGroup";

export const Form = props => {
  const { isDeploying, form, touched, data, errors, isValid, interacted, resetField, setData } = props;
  const { isConnected } = useConnect();
  const { activeChain } = useNetwork();
  const stateWizardForm = useStore();
  const isDateOpeningSubmissionsValid =
    data()?.datetimeOpeningSubmissions && !isPast(new Date(data().datetimeOpeningSubmissions));
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
    onPress: () => stateWizardForm.setCurrentStep(4),
  });

  return (
    <form ref={form} className="w-full">
      <fieldset>
        <legend
          className={`text-neutral-12 uppercase font-bold tracking-wider text-xs ${
            !isConnected || activeChain?.unsupported === true || isDeploying === true ? "text-opacity-50" : ""
          }`}
        >
          The basics
        </legend>
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
                The description of your contest
              </FormField.Description>
              <FormTextarea
                required
                disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
                aria-invalid={errors().contestDescription?.length > 0 === true ? "true" : "false"}
                className="max-w-full w-auto 2xs:w-full"
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

          <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label hasError={errors().votingTokenAddress?.length > 0 === true} htmlFor="votingTokenAddress">
                Voting token address{" "}
              </FormField.Label>
              <FormField.Description id="input-votingtokenaddress-description">
                The Ethereum address of your voting token
              </FormField.Description>
              <FormInput
                required
                disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
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

      <fieldset className="my-6">
        <legend
          className={`text-neutral-12 uppercase font-bold tracking-wider text-xs ${
            !isConnected || activeChain?.unsupported === true || isDeploying === true ? "text-opacity-50" : ""
          }`}
        >
          Submissions
        </legend>
        <div className="space-y-6">
          <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
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
                onChange={() => {
                  resetField("datetimeOpeningVoting");
                  resetField("datetimeClosingVoting");
                  resetField("usersQualifyToVoteAtAnotherDatetime");
                }}
                disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
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
              className="min:block text-2xs text-neutral-11"
            >
              month / day / year, hour:minute AM/PM <br />
              Timezone: ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </FormField.HelpBlock>

            <FormField.HelpBlock
              hasError={errors().datetimeOpeningSubmissions?.length > 0 === true || !isDateOpeningSubmissionsValid}
              id="input-datetimeopeningsubmissions-helpblock-2"
            >
              The opening date for submissions can't be in the past
            </FormField.HelpBlock>
          </FormField>

          <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label
                className="flex flex-wrap"
                hasError={errors().submissionMaxNumber?.length > 0 === true}
                htmlFor="submissionMaxNumber"
              >
                Maximum number of submissions in contest{" "}
                <span className="text-2xs text-neutral-10 pis-1">(recommended)</span>
              </FormField.Label>
              <FormField.Description id="input-numberoftokens-description">
                The maximum number of submissions your contest will show
              </FormField.Description>
              <FormInput
                required
                disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
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
            disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
            value={data()?.submissionOpenToAll}
            onChange={e => {
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
                  disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
                  aria-invalid={
                    touched()?.requiredNumberOfTokenToSubmit && !isRequiredNumberOfTokenToSubmitValid ? "true" : "false"
                  }
                  placeholder="200"
                  required={data()?.submissionOpenToAll === false}
                  className="mx-2 max-w-auto w-[12ex]"
                  size="sm"
                  type="number"
                  name="requiredNumberOfTokenToSubmit"
                  id="requiredNumberOfTokenToSubmit"
                  min={1}
                  step={1}
                  hasError={touched()?.requiredNumberOfTokenToSubmit && !isRequiredNumberOfTokenToSubmitValid}
                  aria-describedby="input-requirednumberoftoken-helpblock"
                />{" "}
                token{data()?.requiredNumberOfTokenToSubmit > 1 ? "s" : ""} to submit
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
            disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
            value={data()?.noSubmissionLimitPerUser}
            onChange={e => {
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
                  disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}
                  aria-invalid={
                    touched()?.submissionPerUserMaxNumber && !isSubmissionNumberLimitValid ? "true" : "false"
                  }
                  placeholder="1"
                  className="mx-2 max-w-auto w-[12ex]"
                  size="sm"
                  type="number"
                  name="submissionPerUserMaxNumber"
                  id="submissionPerUserMaxNumber"
                  min={1}
                  step={1}
                  hasError={touched()?.submissionPerUserMaxNumber && !isSubmissionNumberLimitValid}
                  aria-describedby="input-submissionperusermaxnumber-helpblock"
                />{" "}
                entr{data()?.submissionPerUserMaxNumber > 1 ? "ies" : "y"}{" "}
                <span className="text-2xs pis-1ex text-neutral-10">(recommended)</span>
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
          className={`text-neutral-12 uppercase font-bold tracking-wider text-xs ${
            !isConnected || activeChain?.unsupported === true || isDeploying === true ? "text-opacity-50" : ""
          }`}
        >
          Voting
        </legend>
        <div className="space-y-6">
          <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
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
                onChange={() => {
                  resetField("datetimeClosingVoting");
                  resetField("usersQualifyToVoteAtAnotherDatetime");
                }}
                required
                disabled={
                  !data()?.datetimeOpeningSubmissions ||
                  !isConnected ||
                  activeChain?.unsupported === true ||
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
                min={data()?.datetimeOpeningVoting}
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
              className="min:block text-2xs text-neutral-11"
            >
              month / day / year, hour:minute AM/PM <br />
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
              <span className="font-bold">after the opening date for submissions</span>.
            </FormField.HelpBlock>
          </FormField>

          <FormField disabled={!isConnected || activeChain?.unsupported === true || isDeploying === true}>
            <FormField.InputField>
              <FormField.Label
                hasError={
                  errors().datetimeClosingVoting?.length > 0 === true ||
                  (data()?.datetimeClosingVoting && !isDateClosingVotesValid)
                }
                htmlFor="datetimeClosingVoting"
              >
                Voting closes <span className="text-2xs text-neutral-10 pis-1">(and submissions close)</span>
              </FormField.Label>
              <FormField.Description id="input-datetimeclosesvoting-description">
                The date and time on which users won't be able to vote anymore
              </FormField.Description>
              <div className="flex">
                <FormInput
                  onChange={() => {
                    resetField("usersQualifyToVoteAtAnotherDatetime");
                  }}
                  required
                  disabled={
                    !data()?.datetimeOpeningSubmissions ||
                    !data()?.datetimeOpeningVoting ||
                    !isConnected ||
                    activeChain?.unsupported === true ||
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
              className="min:block text-2xs text-neutral-11"
            >
              month / day / year, hour:minute AM/PM <br />
              Timezone: ({Intl.DateTimeFormat().resolvedOptions().timeZone})
            </FormField.HelpBlock>
            <FormField.HelpBlock
              hasError={
                errors().datetimeClosingVoting?.length > 0 === true ||
                (data()?.datetimeClosingVoting && !isDateClosingVotesValid)
              }
              id="input-datetimeclosesvoting-helpblock-2"
            >
              The closes date for votes must be <span className="font-bold">after the opening date for votes</span>.
            </FormField.HelpBlock>
          </FormField>

          <FormRadioGroup
            disabled={
              !isDateClosingVotesValid || !isConnected || activeChain?.unsupported === true || isDeploying === true
            }
            value={data()?.usersQualifyToVoteIfTheyHoldTokenOnVoteStart}
            onChange={e => {
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
              activeChain?.unsupported === true ||
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
                htmlFor="datetimeOpeningVoting"
              >
                Users can vote from date
              </FormField.Label>
              <FormField.Description id="input-datetimeopeningvoting-description">
                A date and time from which users that can send submissions can start voting
              </FormField.Description>
              <FormInput
                required
                size="sm"
                disabled={
                  !isDateClosingVotesValid ||
                  data()?.usersQualifyToVoteIfTheyHoldTokenOnVoteStart !== false ||
                  !isConnected ||
                  activeChain?.unsupported === true ||
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
                min={data()?.datetimeOpeningVoting}
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
              className="min:block text-2xs text-neutral-11"
            >
              month / day / year, hour:minute AM/PM <br />
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
                after the opening date for submissions and before the voting closing date.{" "}
              </span>
              .
            </FormField.HelpBlock>
          </FormField>
        </div>
      </fieldset>
      <div className="pt-6 flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
        <Button
          isLoading={isDeploying === true}
          intent="neutral-oultine"
          disabled={
            !isConnected ||
            activeChain?.unsupported === true ||
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
          {stateWizardForm.dataDeployToken !== null ? "Next" : "Skip"}
        </div>
      </div>
    </form>
  );
};

export default Form;
