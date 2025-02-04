import CreateGradientTitle from "@components/_pages/Create/components/GradientTitle";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import { createEditorConfig } from "@helpers/createEditorConfig";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const CreateContestRulesDescription = () => {
  const { prompt, setPrompt } = useDeployContestStore(state => state);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const editorSummarize = useEditor({
    ...createEditorConfig({
      content: prompt.summarize,
      placeholderText: isMobile
        ? "core team will pick best feature idea"
        : "our core team will vote on $1000 for best feature proposal",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        setPrompt({
          ...prompt,
          summarize: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorSummarize),
  });

  const editorEvaluateVoters = useEditor({
    ...createEditorConfig({
      content: prompt.evaluateVoters,
      placeholderText: isMobile
        ? "pick which will bring the most users"
        : "voters should vote on the feature that will bring the most users",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        setPrompt({
          ...prompt,
          evaluateVoters: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorEvaluateVoters),
  });

  const editorContactDetails = useEditor({
    ...createEditorConfig({
      content: prompt.contactDetails ?? "",
      placeholderText: isMobile
        ? "i’m on telegram: @me"
        : "we have a telegram group for everyone to coordinate at tgexample.com",
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();

        setPrompt({
          ...prompt,
          contactDetails: content,
        });
      },
    }),
    onFocus: () => setActiveEditor(editorContactDetails),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex bg-true-black z-10 justify-start w-full md:w-[650px] p-1 border-y border-neutral-2">
        <TipTapEditorControls editor={activeEditor ? activeEditor : editorSummarize} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <CreateGradientTitle additionalInfo="required">
              summarize the contest, rewards, and voters
            </CreateGradientTitle>
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
            <CreateGradientTitle additionalInfo="required">
              how should voters evaluate if an entry is <i>good</i> ?
            </CreateGradientTitle>

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
          <div className="flex flex-col gap-4">
            <CreateGradientTitle additionalInfo="recommended">
              what’s the best way for players to reach you?
            </CreateGradientTitle>
            <div
              className={`w-full md:w-[656px] bg-true-black rounded-[16px] border-true-black ${isMobile ? "" : "shadow-file-upload p-2"}`}
            >
              <EditorContent
                editor={editorContactDetails}
                className="p-4 text-[16px] bg-secondary-1 outline-none rounded-[16px] w-full md:w-[640px] overflow-y-auto h-14 md:h-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestRulesDescription;
