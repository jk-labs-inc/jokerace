import Iframe from "@components/tiptap/Iframe";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import { DisableEnter, ShiftEnterCreateExtension } from "@helpers/editor";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { useEffect, useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import ErrorMessage from "../../components/Error";
import StepCircle from "../../components/StepCircle";
import TipMessage from "../../components/Tip";
import { useNextStep } from "../../hooks/useNextStep";
import { validationFunctions } from "../../utils/validation";

const CreateContestPrompt = () => {
  const { step, prompt, setPrompt, errors } = useDeployContestStore(state => state);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [componentMounted, setComponentMounted] = useState(false);

  const currentStepError = errors.find(error => error.step === step);
  const promptValidation = validationFunctions.get(step);
  const onNextStep = useNextStep([() => promptValidation?.[0].validation(prompt)]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ShiftEnterCreateExtension,
      DisableEnter,
      TipTapImage,
      TiptapExtensionLink,
      Placeholder.configure({
        emptyEditorClass: "is-editor-create-flow-empty",
        placeholder: "eg. “tell us why you should build this project — winner gets $10k”",
      }),
      Iframe,
    ],
    content: prompt,
    editorProps: {
      attributes: {
        class: "prose prose-invert flex-grow focus:outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setPrompt(content);
    },
  });

  // Not ideal approach, but for now the right one since handleDomEvents in editor config is not receiving the prompt at given time
  useEffect(() => {
    // Ignore "Enter" presses for the first 100ms after the component is mounted
    const timeoutId = setTimeout(() => setComponentMounted(true), 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleEnterPress = (event: KeyboardEvent) => {
      if (event.shiftKey || !componentMounted) {
        return;
      }
      if (event.key === "Enter") {
        onNextStep();
      }
    };

    window.addEventListener("keydown", handleEnterPress);

    return () => {
      window.removeEventListener("keydown", handleEnterPress);
    };
  }, [onNextStep, componentMounted]);

  useEffect(() => {
    if (editor) {
      const updateHandler = () => {
        setIsTextSelected(!editor.state.selection.empty);
      };

      editor.on("update", updateHandler);
      editor.on("selectionUpdate", updateHandler);

      return () => {
        editor.off("update", updateHandler);
        editor.off("selectionUpdate", updateHandler);
      };
    }
  }, [editor]);

  const tipMessage = () => {
    return (
      <p className="hidden md:flex items-center">
        <span className="font-bold flex items-center gap-1 mr-1">
          shift <Image src="/create-flow/shift.png" alt="shift" width={14} height={14} /> + enter{" "}
          <Image src="/create-flow/enter.png" alt="enter" width={14} height={14} />
        </span>
        to make a line break.
        <span className="font-bold mr-1 ml-1">select text</span>
        to access rich text options.
      </p>
    );
  };

  return (
    <div className="mt-16 lg:mt-[100px] animate-swingInLeft">
      <div className="flex flex-col lg:flex-row items-start gap-5 text-[20px] md:text-[24px]">
        <StepCircle step={step + 1} />
        <div className="flex flex-col gap-5">
          <p className="text-neutral-11 font-normal">what are the instructions for the contest? what are the rules?</p>
          <p className="text-primary-10 font-bold">what’s the full prompt for your contest?</p>
        </div>
      </div>

      <div className="mt-4 lg:ml-[70px]">
        {isTextSelected && (
          <TipTapEditorControls editor={editor} className="rounded-[10px] bg-neutral-2 animate-fadeIn mb-2" />
        )}

        <EditorContent
          editor={editor}
          className="border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 w-[300px] md:w-[600px] overflow-y-auto max-h-[300px] pb-2"
        />

        {currentStepError ? (
          <ErrorMessage error={(currentStepError || { message: "" }).message} />
        ) : (
          <TipMessage tip={tipMessage()} error={""} />
        )}

        <div className="mt-12 inline-flex flex-col gap-7">
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestPrompt;
