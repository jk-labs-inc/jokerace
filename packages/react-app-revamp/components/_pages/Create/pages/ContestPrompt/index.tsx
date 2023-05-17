import Iframe from "@components/tiptap/Iframe";
import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import { convertDocxToHtml } from "@helpers/editor";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { useEffect, useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import ErrorMessage from "../../components/Error";
import FileUpload from "../../components/FileUpload";
import TipMessage from "../../components/Tip";
import { useNextStep } from "../../hooks/useNextStep";

const CreateContestPrompt = () => {
  const { step, prompt, setPrompt, errors } = useDeployContestStore(state => state);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const currentStepError = errors.find(error => error.step === step);

  const promptValidation = () => {
    let parser = new DOMParser();
    const doc = parser.parseFromString(prompt, "text/html");

    if (!doc.body.textContent?.trim()) {
      return "Contest prompt length shouldn't be empty";
    }

    return "";
  };

  const onNextStep = useNextStep(promptValidation);

  const editor = useEditor({
    extensions: [
      StarterKit,
      // DisableEnter,
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
      <p className="flex items-center">
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

  const onFileSelect = (file: File) => {
    convertDocxToHtml(file)
      .then((html: string) => {
        editor?.commands.setContent(html);
        setPrompt(html);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="mt-[100px]">
      <Description
        step={step + 1}
        title="what’s the full prompt for your contest?"
        additionalContent="what are the instructions for the contest? what are the rules?"
      />
      <div className="mt-4 ml-[70px]">
        {isTextSelected && (
          <TipTapEditorControls editor={editor} className="rounded-[10px] bg-neutral-2 animate-fadeIn mb-2" />
        )}

        <EditorContent
          editor={editor}
          className="border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 w-[600px] pb-2"
        />

        {currentStepError ? (
          <ErrorMessage error={(currentStepError || { message: "" }).message} />
        ) : (
          <TipMessage tip={tipMessage()} error={""} />
        )}

        <div className="mt-12 inline-flex flex-col gap-7">
          <FileUpload onFileSelect={onFileSelect} />
          <CreateNextButton step={step + 1} onClick={onNextStep} />
        </div>
      </div>
    </div>
  );
};

export default CreateContestPrompt;
