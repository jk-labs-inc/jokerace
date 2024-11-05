import DialogModalV4 from "@components/UI/DialogModalV4";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import { createEditorConfig } from "@helpers/createEditorConfig";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface EditContestPromptModalProps {
  isOpen: boolean;
  contestDescription: string;
  setIsCloseModal?: (isOpen: boolean) => void;
  handleEditPrompt?: (contestDescription: string) => void;
  handleSavePrompt?: () => void;
}

const EditContestPromptModal: FC<EditContestPromptModalProps> = ({
  isOpen,
  contestDescription,
  setIsCloseModal,
  handleEditPrompt,
  handleSavePrompt,
}) => {
  const editorContestDescription = useEditor({
    ...createEditorConfig({
      content: contestDescription,
      placeholderText: "here is my contest description...",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        handleEditPrompt?.(content);
      },
    }),
  });

  const onSavePrompt = () => {
    if (editorContestDescription?.isEmpty) return;

    handleSavePrompt?.();
    setIsCloseModal?.(false);
  };

  return (
    <DialogModalV4 isOpen={isOpen} onClose={() => setIsCloseModal?.(false)}>
      <div className="flex flex-col gap-14 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center">
          <p className="text-[24px] text-neutral-11 font-bold">edit prompt</p>
          <img
            src="/modal/modal_close.svg"
            width={39}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer"
            onClick={() => setIsCloseModal?.(false)}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div
            className="flex justify-start w-full md:w-[600px] px-1 py-2 sticky top-0 z-10
            bg-true-black/20 backdrop-blur border-y border-neutral-10/30
            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]
            transition-all duration-300"
          >
            <TipTapEditorControls editor={editorContestDescription} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-true-black w-full md:w-[600px] rounded-[16px] border-true-black md:shadow-file-upload md:p-4">
              <EditorContent
                editor={editorContestDescription}
                className="bg-secondary-1 w-full rounded-[16px] outline-none p-4"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {editorContestDescription?.isEmpty ? (
            <p className="text-[16px] font-bold text-negative-11">contest description can't be empty!</p>
          ) : (
            ""
          )}
          <button
            className="bg-gradient-purple self-center md:self-start rounded-[40px] w-80 h-10 text-center text-true-black text-[16px] font-bold hover:opacity-80 transition-opacity duration-300 ease-in-out"
            onClick={onSavePrompt}
          >
            save prompt
          </button>
        </div>
      </div>
    </DialogModalV4>
  );
};

export default EditContestPromptModal;
