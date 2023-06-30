import {
  IconEditorAnchor,
  IconEditorBold,
  IconEditorClearFormat,
  IconEditorCode,
  IconEditorCodeBlock,
  IconEditorH1,
  IconEditorH2,
  IconEditorH3,
  IconEditorH4,
  IconEditorH5,
  IconEditorImage,
  IconEditorItalic,
  IconEditorListOrdered,
  IconEditorListUnordered,
  IconEditorParagraph,
  IconEditorQuote,
  IconEditorRedo,
  IconEditorRemoveAnchor,
  IconEditorStrike,
  IconEditorUndo,
} from "@components/UI/Icons";
import { Editor } from "@tiptap/react";
import styles from "./styles.module.css";

const Separator = () => {
  return (
    <div className="flex items-center" aria-hidden="true">
      <div className="h-3/4 border-is-2 border-solid border-true-white border-opacity-10" />
    </div>
  );
};

interface TipTapEditorControlsProps {
  editor: Editor | null;
  className?: string;
}

export const TipTapEditorControls = (props: TipTapEditorControlsProps) => {
  const { editor } = props;
  if (!editor) {
    return null;
  }

  return (
    <div className={`inline-flex flex-wrap space-i-1 ${props.className}`}>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${styles.control} ${editor.isActive("bold") ? styles["control--active"] : ""} `}
      >
        <IconEditorBold />
        <span className="sr-only">Toggle bold text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${styles.control} ${editor.isActive("italic") ? styles["control--active"] : ""}`}
      >
        <IconEditorItalic />
        <span className="sr-only">Toggle italic text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${styles.control} ${editor.isActive("strike") ? styles["control--active"] : ""}`}
      >
        <IconEditorStrike />
        <span className="sr-only">Toggle striked text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`${styles.control} ${editor.isActive("code") ? styles["control--active"] : ""}`}
      >
        <IconEditorCode />
        <span className="sr-only">Toggle code text formatting</span>
      </button>
      <Separator />
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`${styles.control} ${editor.isActive("paragraph") ? styles["control--active"] : ""}`}
      >
        <IconEditorParagraph />
        <span className="sr-only">Toggle paragraph formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${styles.control} ${editor.isActive("heading", { level: 1 }) ? styles["control--active"] : ""}`}
      >
        <IconEditorH1 />
        <span className="sr-only">Toggle heading 1 text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${styles.control} ${editor.isActive("heading", { level: 2 }) ? styles["control--active"] : ""}`}
      >
        <IconEditorH2 />
        <span className="sr-only">Toggle heading 2 text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`${styles.control} ${editor.isActive("heading", { level: 3 }) ? styles["control--active"] : ""}`}
      >
        <IconEditorH3 />
        <span className="sr-only">Toggle heading 3 text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`${styles.control} ${editor.isActive("heading", { level: 4 }) ? styles["control--active"] : ""}`}
      >
        <IconEditorH4 />
        <span className="sr-only">Toggle heading 4 text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={`${styles.control} ${editor.isActive("heading", { level: 5 }) ? styles["control--active"] : ""}`}
      >
        <IconEditorH5 />
        <span className="sr-only">Toggle heading 5 text formatting</span>
      </button>
      <button
        type="button"
        className={`${styles.control} ${editor.isActive("link") ? styles["control--active"] : ""}`}
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt(previousUrl ? "Change Link URL" : "Paste link URL", previousUrl);

          // cancelled
          if (url === null) return;

          // empty
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }

          // update link
          editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
        }}
        title="Link"
      >
        <IconEditorAnchor />
        <span className="sr-only">Add link from selected text</span>
      </button>

      <button
        className={`${styles.control} disabled:opacity-50`}
        disabled={!editor.isActive("link")}
        onClick={() => {
          editor.commands.unsetLink();
        }}
        title="Remove link"
        type="button"
      >
        <IconEditorRemoveAnchor />
        <span className="sr-only">Remove link from selected text</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${styles.control} ${editor.isActive("bulletList") ? styles["control--active"] : ""}`}
      >
        <IconEditorListUnordered />
        <span className="sr-only">Toggle bullet list text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${styles.control} ${editor.isActive("orderedList") ? styles["control--active"] : ""}`}
      >
        <IconEditorListOrdered />
        <span className="sr-only">Toggle ordered list text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${styles.control} ${editor.isActive("codeBlock") ? styles["control--active"] : ""}`}
      >
        <IconEditorCodeBlock />
        <span className="sr-only">Toggle code block text formatting</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${styles.control} ${editor.isActive("blockquote") ? styles["control--active"] : ""}`}
      >
        <IconEditorQuote />
        <span className="sr-only">Toggle blockquote text formatting</span>
      </button>
      <button
        type="button"
        className={`${styles.control} ${editor.isActive("image") ? styles["control--active"] : ""}`}
        onClick={() => {
          const url = window.prompt(
            "Your image URL (must end with a valid image extension like .png, .jpeg, .gif ...).",
          );

          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      >
        <IconEditorImage />
        <span className="sr-only">Add an image</span>
      </button>
      <Separator />
      <button
        type="button"
        className={`${styles.text} ${styles.control}`}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <span className="text-2xs">Divider</span>
        <span className="sr-only">Add a divider</span>
      </button>
      <Separator />
      <button type="button" className={styles.control} onClick={() => editor.chain().focus().undo().run()}>
        <IconEditorUndo />
        <span className="sr-only">Undo previous action</span>
      </button>
      <button type="button" className={styles.control} onClick={() => editor.chain().focus().redo().run()}>
        <IconEditorRedo />
        <span className="sr-only">Redo previous action</span>
      </button>
      <button type="button" className={styles.control} onClick={() => editor.chain().focus().clearNodes().run()}>
        <IconEditorClearFormat />
        <span className="sr-only">Clear all formatting in seleted text</span>
      </button>
    </div>
  );
};

export default TipTapEditorControls;
