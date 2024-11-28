import ChargeLayoutSubmission from "@components/ChargeLayout/components/Submission";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import { FOOTER_LINKS } from "@config/links";
import { Switch } from "@headlessui/react";
import { emailRegex } from "@helpers/regex";
import { useContestStore } from "@hooks/useContest/store";
import { Charge } from "@hooks/useDeployContest/types";
import useMetadataFields from "@hooks/useMetadataFields";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import useSubmitProposal from "@hooks/useSubmitProposal";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { Editor } from "@tiptap/react";
import { type GetBalanceReturnType } from "@wagmi/core";
import { FC, useState } from "react";
import DialogModalSendProposalEditor from "../components/Editor";
import DialogModalSendProposalEmailSubscription from "../components/EmailSubscription";
import DialogModalSendProposalEntryPreviewLayout from "../components/EntryPreviewLayout";
import DialogModalSendProposalMetadataFields from "../components/MetadataFields";
import DialogModalSendProposalSuccessLayout from "../components/SuccessLayout";
import { isEntryPreviewPrompt } from "../utils";

interface DialogModalSendProposalDesktopLayoutProps {
  chainName: string;
  contestId: string;
  proposal: string;
  editorProposal: Editor | null;
  address: string;
  isOpen: boolean;
  isCorrectNetwork: boolean;
  isDragging: boolean;
  charge: Charge | null;
  accountData: GetBalanceReturnType | undefined;
  setIsOpen: (isOpen: boolean) => void;
  handleDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onSwitchNetwork?: () => void;
  onSubmitProposal?: () => void;
}

const DialogModalSendProposalDesktopLayout: FC<DialogModalSendProposalDesktopLayoutProps> = ({
  chainName,
  contestId,
  proposal,
  editorProposal,
  address,
  isOpen,
  isCorrectNetwork,
  charge,
  accountData,
  isDragging,
  setIsOpen,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  onSwitchNetwork,
  onSubmitProposal,
}) => {
  const { contestPrompt } = useContestStore(state => state);
  const {
    wantsSubscription,
    setWantsSubscription,
    setEmailForSubscription,
    emailForSubscription,
    emailAlreadyExists,
    setEmailAlreadyExists,
  } = useSubmitProposalStore(state => state);
  const { isLoading, isSuccess } = useSubmitProposal();
  const { proposalId } = useSubmitProposalStore(state => state);
  const [emailError, setEmailError] = useState<string | null>(null);
  const insufficientBalance = (accountData?.value ?? 0) < (charge?.type.costToPropose ?? 0);
  const tosHref = FOOTER_LINKS.find(link => link.label === "Terms")?.href;
  const showEntryCharge = charge && charge.type.costToPropose && accountData && isCorrectNetwork;
  const { isLoading: isMetadataFieldsLoading, isError: isMetadataFieldsError } = useMetadataFields();
  const { fields: metadataFields } = useMetadataStore(state => state);
  const [error, setError] = useState<string | null>(null);
  const hasEntryPreview = metadataFields.length > 0 && isEntryPreviewPrompt(metadataFields[0].prompt);

  const handleCheckboxChange = (checked: boolean) => {
    setWantsSubscription(checked);
    setEmailError(null);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setWantsSubscription(true);
    } else {
      setWantsSubscription(false);
    }
    setEmailForSubscription(event.target.value);
    setEmailError(null);
    setEmailAlreadyExists(false);
  };

  const handleConfirm = () => {
    setError(null);

    if (metadataFields.length > 0) {
      if (isAnyMetadataFieldEmpty()) {
        setError("Please fill in all additional fields before submitting.");
        return;
      }
    } else {
      if (!proposal.length || editorProposal?.isEmpty) {
        setError("Please fill in your proposal.");
        return;
      }
    }

    if (insufficientBalance) {
      setError("Insufficient balance to submit a proposal.");
      return;
    }

    if (wantsSubscription && !emailForSubscription) {
      setEmailError("Please enter an email address.");
      return;
    }

    if (!wantsSubscription && emailForSubscription) {
      setEmailError("Please check the box if you want to be notified.");
      return;
    }

    if (emailForSubscription && !emailRegex.test(emailForSubscription)) {
      setEmailError("Invalid email address.");
      return;
    }

    setEmailError(null);
    onSubmitProposal?.();
  };

  const isAnyMetadataFieldEmpty = () => {
    if (metadataFields.length === 0) return false;
    return metadataFields.some(field => field.inputValue === "");
  };

  return (
    <DialogModalV3
      title="submission"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="w-full xl:w-[1100px]"
      disableClose={!!(isSuccess && proposalId)}
    >
      <div className="flex flex-col gap-4 md:pl-[50px] lg:pl-[100px] mt-[60px] mb-[60px]">
        {isSuccess && proposalId ? (
          <div className="flex flex-col gap-8">
            <p className="text-[24px] font-bold text-neutral-11">your submission is live!</p>
            <DialogModalSendProposalSuccessLayout proposalId={proposalId} chainName={chainName} contestId={contestId} />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <ContestPrompt type="modal" prompt={contestPrompt} hidePrompt />
              <div className="flex flex-col gap-2">
                <UserProfileDisplay ethereumAddress={address ?? ""} shortenOnFallback={true} />
              </div>
            </div>
            <div className="flex flex-col gap-8 rounded-md md:w-[650px]">
              {hasEntryPreview ? (
                <DialogModalSendProposalEntryPreviewLayout
                  entryPreviewLayout={metadataFields[0].prompt}
                  editorProposal={editorProposal}
                  isDragging={isDragging}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                />
              ) : (
                <DialogModalSendProposalEditor
                  editorProposal={editorProposal}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  isDragging={isDragging}
                />
              )}

              {isMetadataFieldsLoading ? (
                <p className="loadingDots font-sabo text-[16px] text-neutral-14">loading metadata fields</p>
              ) : isMetadataFieldsError ? (
                <p className="text-negative-11">Error while loading metadata fields. Please reload the page.</p>
              ) : metadataFields.length > 0 ? (
                <DialogModalSendProposalMetadataFields />
              ) : null}
              <div className="flex flex-col gap-4 -mt-2">
                <div className="flex gap-4 items-center">
                  <Switch
                    checked={wantsSubscription}
                    onChange={handleCheckboxChange}
                    className="group relative flex w-12 h-6 cursor-pointer rounded-full bg-neutral-10 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-secondary-11"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block size-6 translate-x-0 rounded-full bg-neutral-11 ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                    />
                  </Switch>
                  <p className="text-[16px] text-neutral-11 font-bold">get updates on contests</p>
                </div>
                {wantsSubscription ? (
                  <DialogModalSendProposalEmailSubscription
                    emailAlreadyExists={emailAlreadyExists ?? false}
                    emailError={emailError}
                    emailForSubscription={emailForSubscription ?? ""}
                    tosHref={tosHref ?? ""}
                    handleEmailChange={handleEmailChange}
                  />
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-12 mt-12">
              {showEntryCharge ? <ChargeLayoutSubmission charge={charge} accountData={accountData} /> : null}

              {isCorrectNetwork ? (
                <div className="flex flex-col gap-2">
                  <ButtonV3
                    colorClass="bg-gradient-purple rounded-[40px]"
                    size={ButtonSize.EXTRA_LARGE_LONG}
                    onClick={handleConfirm}
                    isDisabled={isLoading}
                  >
                    submit
                  </ButtonV3>
                  {error && <p className="text-negative-11 text-[14px] font-bold">{error}</p>}
                </div>
              ) : (
                <ButtonV3
                  colorClass="bg-gradient-create rounded-[40px]"
                  size={ButtonSize.EXTRA_LARGE_LONG}
                  onClick={onSwitchNetwork}
                >
                  switch network
                </ButtonV3>
              )}
            </div>
          </div>
        )}
      </div>
    </DialogModalV3>
  );
};

export default DialogModalSendProposalDesktopLayout;
