import ButtonV3, { ButtonSize } from "@components/UI/ButtonV3";
import DialogModalV3 from "@components/UI/DialogModalV3";
import EthereumAddress from "@components/UI/EtheuremAddress";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import ContestPrompt from "@components/_pages/Contest/components/Prompt";
import { useContestStore } from "@hooks/useContest/store";
import useSubmitProposal from "@hooks/useSubmitProposal";
import { Editor, EditorContent } from "@tiptap/react";
import { FC } from "react";

interface DialogModalSendProposalDesktopLayoutProps {
  proposal: string;
  editorProposal: Editor | null;
  address: string;
  formattedDate: string | null;
  isOpen: boolean;
  isCorrectNetwork: boolean;
  isDragging: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onSwitchNetwork?: () => void;
  onSubmitProposal?: () => void;
}

const DialogModalSendProposalDesktopLayout: FC<DialogModalSendProposalDesktopLayoutProps> = ({
  proposal,
  editorProposal,
  address,
  formattedDate,
  isOpen,
  isCorrectNetwork,
  isDragging,
  setIsOpen,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  onSwitchNetwork,
  onSubmitProposal,
}) => {
  const { contestPrompt } = useContestStore(state => state);
  const { isLoading } = useSubmitProposal();

  return (
    <DialogModalV3
      title="submission"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="w-full xl:w-[1110px] 3xl:w-[1300px]"
    >
      <div className="flex flex-col gap-4 md:pl-[50px] lg:pl-[100px] mt-[60px] mb-[60px]">
        <ContestPrompt type="modal" prompt={contestPrompt} hidePrompt />
        <div className="flex flex-col gap-2">
          <EthereumAddress ethereumAddress={address ?? ""} shortenOnFallback={true} />
          <p className="text-[16px] font-bold text-neutral-10">{formattedDate}</p>
        </div>
        <div className="flex flex-col min-h-[12rem] rounded-md md:w-[650px]">
          <div className="flex bg-true-black z-10 justify-start w-full :px-1 py-2 border-y border-neutral-10">
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
        <div className="flex mt-2">
          {isCorrectNetwork ? (
            <ButtonV3
              colorClass="bg-gradient-vote rounded-[40px]"
              size={ButtonSize.LARGE}
              onClick={() => onSubmitProposal?.()}
              isDisabled={isLoading || !proposal.length || !editorProposal?.getText().length}
            >
              submit!
            </ButtonV3>
          ) : (
            <ButtonV3 colorClass="bg-gradient-create rounded-[40px]" size={ButtonSize.LARGE} onClick={onSwitchNetwork}>
              switch network
            </ButtonV3>
          )}
        </div>
      </div>
    </DialogModalV3>
  );
};

export default DialogModalSendProposalDesktopLayout;
