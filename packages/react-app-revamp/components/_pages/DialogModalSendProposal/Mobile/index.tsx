import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import { useContestStore } from "@hooks/useContest/store";
import { Editor, EditorContent } from "@tiptap/react";
import { FC } from "react";

interface DialogModalSendProposalMobileLayoutProps {
  proposal: string;
  editorProposal: Editor | null;
  address: string;
  formattedDate: string | null;
  isOpen: boolean;
  isLoading: boolean;
  isCorrectNetwork: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSwitchNetwork?: () => void;
  onSubmitProposal?: () => void;
}

const DialogModalSendProposalMobileLayout: FC<DialogModalSendProposalMobileLayoutProps> = ({
  proposal,
  editorProposal,
  address,
  formattedDate,
  isOpen,
  isLoading,
  isCorrectNetwork,
  setIsOpen,
  onSwitchNetwork,
  onSubmitProposal,
}) => {
  const { contestPrompt } = useContestStore(state => state);
  const isInPwaMode = window.matchMedia("(display-mode: standalone)").matches;

  return (
    <DialogModalV3 isOpen={isOpen} title="sendProposalMobile" isMobile>
      <div className={`flex flex-col gap-8 ${isInPwaMode ? "mt-0" : "mt-12"}`}>
        <div className="flex justify-between items-center">
          <p className="text-neutral-11 text-[16px] font-bold" onClick={() => setIsOpen(false)}>
            cancel
          </p>
          {isCorrectNetwork ? (
            <ButtonV3
              colorClass="bg-gradient-vote rounded-[40px]"
              size={ButtonSize.SMALL}
              onClick={() => onSubmitProposal?.()}
              isDisabled={isLoading || !proposal.length || !editorProposal?.getText().length}
            >
              submit!
            </ButtonV3>
          ) : (
            <ButtonV3
              colorClass="bg-gradient-create rounded-[40px]"
              size={ButtonSize.DEFAULT}
              onClick={onSwitchNetwork}
            >
              switch network
            </ButtonV3>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <ContestPrompt type="modal" prompt={contestPrompt} hidePrompt />
          <div className="flex flex-col gap-2">
            <EthereumAddress ethereumAddress={address ?? ""} shortenOnFallback={true} />
            <p className="text-[16px] font-bold text-neutral-10">{formattedDate}</p>
          </div>
          <div className="flex flex-col min-h-[12rem] rounded-md md:w-[650px]">
            <div className="flex w-full px-1 py-2 border-y border-neutral-10">
              <TipTapEditorControls editor={editorProposal} />
            </div>

            <EditorContent
              editor={editorProposal}
              className={`md:border-b border-primary-2 bg-transparent outline-none placeholder-neutral-9 w-full md:w-[650px] overflow-y-auto h-auto max-h-[300px] pb-2 `}
            />
          </div>
        </div>
      </div>
    </DialogModalV3>
  );
};

export default DialogModalSendProposalMobileLayout;
