import { createEditorConfig } from "@components/_pages/Create/pages/ContestPrompt";
import DialogModalV4 from "@components/UI/DialogModalV4";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface EditContestPromptModalProps {
  isOpen: boolean;
  prompt: {
    summaryContent: string;
    evaluateContent: string;
    contactDetailsContent: string;
  };
  setIsCloseModal?: (isOpen: boolean) => void;
  handleEditPrompt?: (prompt: {
    summaryContent: string;
    evaluateContent: string;
    contactDetailsContent: string;
  }) => void;
  handleSavePrompt?: () => void;
}

const EditContestPromptModal: FC<EditContestPromptModalProps> = ({
  isOpen,
  prompt,
  setIsCloseModal,
  handleEditPrompt,
  handleSavePrompt,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);

  const editorSummarize = useEditor({
    ...createEditorConfig({
      content: prompt.summaryContent,
      placeholderText: isMobile
        ? "core team will pick best feature idea"
        : "our core team will vote on $1000 for best feature proposal",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        handleEditPrompt?.({
          ...prompt,
          summaryContent: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorSummarize),
  });

  const editorEvaluateVoters = useEditor({
    ...createEditorConfig({
      content: prompt.evaluateContent,
      placeholderText: isMobile
        ? "pick which will bring the most users"
        : "voters should vote on the feature that will bring the most users",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        handleEditPrompt?.({
          ...prompt,
          evaluateContent: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorEvaluateVoters),
  });

  const editorContactDetails = useEditor({
    ...createEditorConfig({
      content: prompt.contactDetailsContent ?? "",
      placeholderText: isMobile
        ? "i’m on telegram: @me"
        : "we have a telegram group for everyone to coordinate at tgexample.com",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        handleEditPrompt?.({
          ...prompt,
          contactDetailsContent: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorContactDetails),
  });

  const onSavePrompt = () => {
    handleSavePrompt?.();
    setIsCloseModal?.(false);
  };

  return (
    <DialogModalV4 isOpen={isOpen} onClose={() => setIsCloseModal?.(false)}>
      <div className="flex flex-col gap-14 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16">
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
          <div className="flex bg-true-black z-10 justify-start w-full md:w-[650px] px-1 py-2 border-y border-neutral-10">
            <TipTapEditorControls editor={activeEditor ? activeEditor : editorSummarize} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <p className="text-[20px] text-neutral-11 font-bold">summarize the contest, rewards, and voters</p>
              <div className="bg-true-black w-full md:w-[600px] rounded-[16px] border-true-black md:shadow-file-upload md:p-4">
                <EditorContent
                  editor={editorSummarize}
                  className="bg-secondary-1 w-full rounded-[16px] outline-none p-4"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-[20px] text-neutral-11 font-bold">
                how should voters evaluate if an entry is <i>good?</i>
              </p>
              <div className="bg-true-black w-full md:w-[600px] rounded-[16px] border-true-black md:shadow-file-upload md:p-4">
                <EditorContent
                  editor={editorEvaluateVoters}
                  className="bg-secondary-1 w-full rounded-[16px] outline-none p-4"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-[20px] text-neutral-11 font-bold">
                what’s the best way for players to reach you? (optional)
              </p>
              <div className="bg-true-black w-full md:w-[600px] rounded-[16px] border-true-black md:shadow-file-upload md:p-4">
                <EditorContent
                  editor={editorContactDetails}
                  className="bg-secondary-1 w-full rounded-[16px] outline-none p-4"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          className="bg-gradient-purple self-center md:self-start rounded-[40px] w-80 h-10 text-center text-true-black text-[16px] font-bold hover:opacity-80 transition-opacity duration-300 ease-in-out"
          onClick={onSavePrompt}
        >
          save prompt
        </button>
      </div>
    </DialogModalV4>
  );
};

export default EditContestPromptModal;
