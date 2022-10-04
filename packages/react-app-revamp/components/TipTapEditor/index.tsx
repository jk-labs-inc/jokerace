import Button from "@components/Button";
import TipTapEditorControls from "@components/TipTapEditorControls";
import { EditorContent } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Iframe from "@components/tiptap/Iframe";
import { useState } from "react";

interface TipTapEditorProps {
  editor: any;
}

export const TipTapPreview = (props: any) => {
  const { content } = props;
  const previewEditor = useEditor({
    extensions: [StarterKit, Image, TiptapExtensionLink, Iframe],
    editorProps: {
      attributes: {
        class: "prose prose-invert normal-case",
      },
    },
    editable: false,
    content: content,
  });
  return <EditorContent editor={previewEditor} />;
};

const TipTapEditor = (props: TipTapEditorProps) => {
  const { editor } = props;
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      {!showPreview && (
        <>
          <div className="flex flex-col min-h-[12rem] rounded-md border border-solid border-true-white border-opacity-20 hover:border-opacity-25 focus-within:border-opacity-40">
            <div className="relative px-1 py-1 border-b-2 border-b-true-white border-opacity-20">
              <TipTapEditorControls editor={editor} />
            </div>

            <EditorContent
              className="flex flex-col flex-grow min-h-[20em] max-h-[26em] overflow-y-auto"
              editor={editor}
            />
          </div>
        </>
      )}
      {showPreview && <TipTapPreview content={editor.getHTML()} />}
      <div className="mt-4">
        <Button
          intent="neutral-outline"
          scale="xs"
          type="button"
          onClick={() => {
            setShowPreview(!showPreview);
          }}
        >
          Toggle preview
        </Button>
      </div>
    </>
  );
};

export default TipTapEditor;
