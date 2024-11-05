import Iframe from "@components/tiptap/Iframe";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { Link as TiptapExtensionLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

interface CreateEditorConfigArgs {
  content: string;
  placeholderText: string;
  onUpdate: any;
}

export const createEditorConfig = ({ content, placeholderText, onUpdate }: CreateEditorConfigArgs) => ({
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
