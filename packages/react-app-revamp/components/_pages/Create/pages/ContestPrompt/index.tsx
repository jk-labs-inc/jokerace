import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import Iframe from "@components/tiptap/Iframe";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";

interface CreateEditorConfigArgs {
  content: string;
  placeholderText: string;
  onUpdate: any;
}

const createEditorConfig = ({ content, placeholderText, onUpdate }: CreateEditorConfigArgs) => ({
  extensions: [
    StarterKit,
    TipTapImage,
    TiptapExtensionLink,
    Placeholder.configure({
      emptyEditorClass: "is-editor-create-flow-empty",
      placeholder: placeholderText,
    }),
    Iframe,
  ],
  content: content,
  editorProps: {
    attributes: {
      class: "prose prose-invert flex-grow focus:outline-none",
    },
  },
  onUpdate: onUpdate,
});

const CreateContestPrompt = () => {
  const { step, prompt, setPrompt, errors } = useDeployContestStore(state => state);
  const currentStepError = errors.find(error => error.step === step);
  const promptValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => promptValidation?.[0].validation(prompt)]);
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
    <div className="create-contest-prompt flex flex-col gap-12 mt-12 lg:mt-[70px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-10">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-12 w-full">
          <div className="flex flex-col gap-2">
            <p className="text-[24px] text-primary-10 font-bold">now for the description</p>
            <div className="flex bg-true-black z-10 justify-start w-full md:w-[650px] px-1 py-2 border-y border-neutral-10">
              <TipTapEditorControls editor={activeEditor ? activeEditor : editorSummarize} />
            </div>
          </div>
          <div className="flex flex-col gap-8 ">
            <p className="text-neutral-11 text-[20px] font-bold">summarize the contest, prizes, and voters:</p>
            <div className="flex flex-col gap-2">
              <EditorContent
                editor={editorSummarize}
                className="border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 w-full md:w-[650px] overflow-y-auto max-h-[300px] pb-2"
              />

              {currentStepError?.message.includes("Contest summary") ? (
                <ErrorMessage error={(currentStepError || { message: "" }).message} />
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-[20px] text-neutral-11 font-bold">
                how should voters evaluate if a submission is <i>good</i> ?
              </p>
              <p className="text-neutral-11 text-[16px] font-normal">
                (ie 50% for originality, 50% for thoughtfulness)
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <EditorContent
                editor={editorEvaluateVoters}
                className="border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 w-full md:w-[650px] overflow-y-auto max-h-[300px] pb-2"
              />

              {currentStepError?.message.includes("Voter evaluation") ? (
                <ErrorMessage error={(currentStepError || { message: "" }).message} />
              ) : (
                <p className="text-[16px] font-bold text-neutral-14">
                  if you are offering rewards, voting must legally be based on skill or talent—not guessing
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8 ">
            <p className="text-neutral-11 text-[20px] font-bold">
              what’s the best way for players to reach you? <span className="font-normal">(optional)</span>
            </p>
            <div className="flex flex-col gap-2">
              <EditorContent
                editor={editorContactDetails}
                className="border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 w-full md:w-[650px] overflow-y-auto max-h-[300px] pb-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <CreateNextButton step={step + 1} onClick={onNextStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContestPrompt;
