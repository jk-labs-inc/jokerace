import ChargeLayout from "@components/ChargeLayout";
import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import UserProfileDisplay from "@components/UI/UserProfileDisplay";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import { FOOTER_LINKS } from "@config/links";
import { emailRegex } from "@helpers/regex";
import { useContestStore } from "@hooks/useContest/store";
import { Charge } from "@hooks/useDeployContest/types";
import { useMetadataStore } from "@hooks/useMetadataFields/store";
import useSubmitProposal from "@hooks/useSubmitProposal";
import { useSubmitProposalStore } from "@hooks/useSubmitProposal/store";
import { Editor, EditorContent } from "@tiptap/react";
import { type GetBalanceReturnType } from "@wagmi/core";
import { FC, useState } from "react";
import DialogModalSendProposalMetadataFields from "../components/MetadataFields";
import DialogModalSendProposalSuccessLayout from "../components/SuccessLayout";

interface DialogModalSendProposalDesktopLayoutProps {
  chainName: string;
  contestId: string;
  proposal: string;
  editorProposal: Editor | null;
  address: string;
  formattedDate: string | null;
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
  formattedDate,
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
  const { fields: metadataFields } = useMetadataStore(state => state);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWantsSubscription(event.target.checked);
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
      className="w-full xl:w-[1110px] 3xl:w-[1300px]"
      disableClose={!!(isSuccess && proposalId)}
    >
      <div className="flex flex-col gap-4 md:pl-[50px] lg:pl-[100px] mt-[60px] mb-[60px]">
        {isSuccess && proposalId ? (
          <div className="flex flex-col gap-8">
            <p className="text-[24px] font-bold text-neutral-11">your submission is live!</p>
            <DialogModalSendProposalSuccessLayout proposalId={proposalId} chainName={chainName} contestId={contestId} />
          </div>
        ) : (
          <>
            <ContestPrompt type="modal" prompt={contestPrompt} hidePrompt />
            <div className="flex flex-col gap-2">
              <UserProfileDisplay ethereumAddress={address ?? ""} shortenOnFallback={true} />
              <p className="text-[16px] font-bold text-neutral-10">{formattedDate}</p>
            </div>
            <div className="flex flex-col gap-8 rounded-md md:w-[650px]">
              <div className="flex flex-col">
                <div className="flex bg-true-black z-10 justify-start w-full px-1 py-2 border-y border-neutral-10">
                  <TipTapEditorControls editor={editorProposal} />
                </div>

                <EditorContent
                  editor={editorProposal}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`md:border-b border-primary-2 bg-transparent outline-none placeholder-neutral-9 w-full md:w-[650px] overflow-y-auto h-auto max-h-[300px] pb-2 ${
                    isDragging ? "backdrop-blur-md opacity-70" : ""
                  }`}
                />
              </div>
              {metadataFields.length ? <DialogModalSendProposalMetadataFields /> : null}
            </div>
            <div className="flex flex-col gap-11 mt-11">
              {showEntryCharge ? <ChargeLayout charge={charge} accountData={accountData} type="propose" /> : null}

              {!insufficientBalance ? (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <label className="checkbox-container">
                      <input type="checkbox" checked={wantsSubscription} onChange={handleCheckboxChange} />
                      <span className="checkmark"></span>
                    </label>

                    <p className="text-[16px] text-neutral-9">i’d like to hear about new contests</p>
                  </div>
                  <div className="flex flex-col gap-1 -mx-4">
                    <input
                      value={emailForSubscription}
                      type="text"
                      className="w-[360px] rounded-[40px] h-8 bg-true-black border border-neutral-9 indent-4 placeholder-neutral-7 focus:outline-none submission-subscription-input"
                      placeholder="myemail@email.com"
                      onChange={handleEmailChange}
                    />
                    {emailError ? (
                      <p className="text-[14px] text-negative-11 font-bold pl-2 mt-2">{emailError}</p>
                    ) : emailAlreadyExists ? (
                      <p className="text-positive-11 text-[12px] font-bold pl-2">
                        your email has already been subscribed! :)
                      </p>
                    ) : (
                      <p className="ml-4 opacity-50 text-neutral-11 text-[12px]">
                        by giving your email, you agree to share it with the contest <br />
                        creator and jk labs, inc., according to{" "}
                        <a
                          className="text-positive-11 hover:text-positive-10"
                          href={tosHref}
                          rel="nofollow noreferrer"
                          target="_blank"
                        >
                          our privacy policy
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ) : null}

              {isCorrectNetwork ? (
                <div className="flex flex-col gap-2">
                  <ButtonV3
                    colorClass="bg-gradient-vote rounded-[40px]"
                    size={ButtonSize.EXTRA_LARGE_LONG}
                    onClick={handleConfirm}
                    isDisabled={isLoading}
                  >
                    submit!
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
          </>
        )}
      </div>
    </DialogModalV3>
  );
};

export default DialogModalSendProposalDesktopLayout;
