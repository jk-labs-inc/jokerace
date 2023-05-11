import TipTapEditorControls from "@components/UI/TipTapEditorControls";
import { DisableEnter } from "@helpers/editor";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { useState } from "react";
import CreateNextButton from "../../components/Buttons/Next";
import Description from "../../components/Description";
import FileUpload from "../../components/FileUpload";
import TipMessage from "../../components/Tip";

const CreateContestPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      DisableEnter,
      Placeholder.configure({
        emptyEditorClass: "is-editor-create-flow-empty",
        placeholder: "eg. “tell us why you should build this project — winner gets $10k”",
      }),
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

  return (
    <>
      <Description
        step={4}
        title="what’s the full prompt for your contest?"
        additionalContent="what are the instructions for the contest? what are the rules?"
      />
      <div className="mt-7 ml-[70px]">
        {/* <TipTapEditorControls editor={editor} /> */}
        <EditorContent
          editor={editor}
          className="border-b border-neutral-11 bg-transparent outline-none placeholder-neutral-9 w-[600px] pb-2"
        />

        <TipMessage tip={tipMessage()} error={""} />

        <div className="mt-12 inline-flex flex-col gap-7">
          <FileUpload />
          <CreateNextButton step={4} />
        </div>
      </div>
    </>
  );
};

export default CreateContestPrompt;
