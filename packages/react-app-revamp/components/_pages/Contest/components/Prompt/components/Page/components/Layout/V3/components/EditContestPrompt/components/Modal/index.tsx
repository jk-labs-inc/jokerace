import CreateFlowPromptPreview from "@components/_pages/Create/components/PromptPreview";
import CreateFlowPreviewToggle from "@components/_pages/Create/components/PreviewToggle";
import DialogModalV4 from "@components/UI/DialogModalV4";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import { createEditorConfig } from "@helpers/createEditorConfig";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { FC, useState } from "react";
import { useMediaQuery } from "react-responsive";

export interface EditPrompt {
  contestSummary: string;
  contestEvaluate: string;
  contestContactDetails: string;
}

interface EditContestPromptModalProps {
  isOpen: boolean;
  prompt: EditPrompt;
  setIsCloseModal?: (isOpen: boolean) => void;
  handleEditPrompt?: (prompt: EditPrompt) => void;
  handleSavePrompt?: () => void;
}

const EditContestPromptModal: FC<EditContestPromptModalProps> = ({
  isOpen,
  prompt,
  setIsCloseModal,
  handleEditPrompt,
  handleSavePrompt,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const editorSummarize = useEditor({
    ...createEditorConfig({
      content: prompt.contestSummary,
      placeholderText: isMobile
        ? "core team will pick best feature idea"
        : "our core team will vote on $1000 for best feature proposal",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        handleEditPrompt?.({
          ...prompt,
          contestSummary: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorSummarize),
  });

  const editorEvaluateVoters = useEditor({
    ...createEditorConfig({
      content: prompt.contestEvaluate,
      placeholderText: isMobile
        ? "pick which will bring the most users"
        : "voters should vote on the feature that will bring the most users",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        handleEditPrompt?.({
          ...prompt,
          contestEvaluate: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorEvaluateVoters),
  });

  const editorContactDetails = useEditor({
    ...createEditorConfig({
      content: prompt.contestContactDetails,
      placeholderText: isMobile
        ? "i’m on telegram: @me"
        : "we have a telegram group for everyone to coordinate at tgexample.com",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        handleEditPrompt?.({
          ...prompt,
          contestContactDetails: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorContactDetails),
  });

  const onSavePrompt = () => {
    if (editorSummarize?.isEmpty || editorEvaluateVoters?.isEmpty) return;

    handleSavePrompt?.();
    setIsCloseModal?.(false);
  };

  return (
    <DialogModalV4 isOpen={isOpen} onClose={() => setIsCloseModal?.(false)}>
      <div className="flex flex-col gap-14 py-6 md:py-16 pl-8 md:pl-32 pr-4 md:pr-16 max-h-screen overflow-y-auto">
        <div className="flex w-full justify-between items-center">
          <div className=" flex items-center justify-between w-full md:w-[656px]">
            <p className="text-[24px] text-neutral-11 font-bold">edit prompt</p>
            <CreateFlowPreviewToggle onClick={() => setIsPreviewOpen(!isPreviewOpen)} />
          </div>
          <img
            src="/modal/modal_close.svg"
            width={39}
            height={33}
            alt="close"
            className="hidden md:block cursor-pointer"
            onClick={() => setIsCloseModal?.(false)}
          />
        </div>
        {isPreviewOpen ? (
          <div className="w-80 xs:w-[460px] sm:w-[560px]">
            <CreateFlowPromptPreview
              summarize={{ content: prompt.contestSummary, isEmpty: editorSummarize?.isEmpty ?? true }}
              evaluateVoters={{ content: prompt.contestEvaluate, isEmpty: editorEvaluateVoters?.isEmpty ?? true }}
              contactDetails={{
                content: prompt.contestContactDetails ?? "",
                isEmpty: editorContactDetails?.isEmpty ?? true,
              }}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-12">
              <div
                className="flex justify-start w-full md:w-[656px] px-1 py-2 sticky top-0 z-10
            bg-true-black/20 backdrop-blur border-y border-neutral-10/30
            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]
            transition-all duration-300"
              >
                <TipTapEditorControls editor={activeEditor ? activeEditor : editorSummarize} />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  <p className="text-neutral-11 text-[20px] font-bold">
                    what’s the best way for players to reach you? <span className="font-normal">(recommended)</span>
                  </p>
                  <div
                    className={`w-full md:w-[656px] bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"}`}
                  >
                    <EditorContent
                      editor={editorContactDetails}
                      className="p-4 text-[16px] bg-secondary-1 outline-none rounded-[16px] w-full md:w-[640px] overflow-y-auto h-20"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-neutral-11 text-[20px] font-bold">summarize the contest, rewards, and voters:</p>
                  <div className="flex flex-col gap-2">
                    <div
                      className={`w-full md:w-[656px] bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"}`}
                    >
                      <EditorContent
                        editor={editorSummarize}
                        className="p-4 text-[16px] bg-secondary-1 outline-none rounded-[16px] w-full md:w-[640px] overflow-y-auto h-52 md:h-36"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-[20px] text-neutral-11 font-bold">
                    how should voters evaluate if an entry is <i>good</i> ?
                  </p>
                  <div className="flex flex-col gap-2">
                    <div
                      className={`w-full md:w-[656px] bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"}`}
                    >
                      <EditorContent
                        editor={editorEvaluateVoters}
                        className="p-4 text-[16px] bg-secondary-1 outline-none rounded-[16px] w-full md:w-[640px] overflow-y-auto h-52 md:h-36"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {editorSummarize?.isEmpty ? (
                <p className="text-[16px] font-bold text-negative-11">contest summary can't be empty!</p>
              ) : editorEvaluateVoters?.isEmpty ? (
                <p className="text-[16px] font-bold text-negative-11">evaluate voters can't be empty!</p>
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
          </>
        )}
      </div>
    </DialogModalV4>
  );
};

export default EditContestPromptModal;
