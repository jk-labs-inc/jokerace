import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import Iframe from "@components/tiptap/Iframe";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";
import { Interweave } from "interweave";

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

  const editorSummarize = useEditor({
    ...createEditorConfig({
      content: prompt.summarize,
      placeholderText: "our core team will vote on $1000 for best feature proposal",
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
      placeholderText: "voters should vote on the feature that will bring the most users",
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

  return (
    <div className="flex flex-col gap-12 mt-12 lg:mt-[100px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-5 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-2 w-full">
          <p className="text-neutral-11 font-bold">let’s let players know how this works.</p>
          <div className="flex bg-true-black z-10 justify-start w-full md:w-[650px] px-1 py-2 border-y border-neutral-10">
            <TipTapEditorControls editor={activeEditor ? activeEditor : editorSummarize} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:ml-[70px]">
        <p className="text-primary-10 text-[24px] font-bold">summarize the contest, prizes, and voters:</p>
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
      <div className="flex flex-col gap-8 lg:ml-[70px]">
        <p className="text-primary-10 text-[24px] font-bold">
          how should voters evaluate if a submission is good? <br />
          <span className="text-neutral-11 text-[24px] font-normal">
            (ie 50% for originality, 50% for thoughtfulness)
          </span>
        </p>
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

      <div className="lg:ml-[70px]">
        <CreateNextButton step={step + 1} onClick={onNextStep} enableEnter={false} />
      </div>
    </div>
  );
};

export default CreateContestPrompt;
