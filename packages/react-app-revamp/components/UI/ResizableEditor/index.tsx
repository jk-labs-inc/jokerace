import { Editor, EditorContent } from "@tiptap/react";
import Image from "next/image";
import { FC, useCallback, useEffect, useRef, useState } from "react";

interface ResizableEditorProps {
  editor: Editor | null;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

const ResizableEditor: FC<ResizableEditorProps> = ({ editor, minHeight = 144, maxHeight = 800, className = "" }) => {
  const [manualHeight, setManualHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      startY.current = e.clientY;
      startHeight.current = containerRef.current?.offsetHeight ?? minHeight;
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";
    },
    [minHeight],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing.current) return;

      const deltaY = e.clientY - startY.current;
      const newHeight = Math.min(maxHeight, Math.max(minHeight, startHeight.current + deltaY));
      setManualHeight(newHeight);
    },
    [minHeight, maxHeight],
  );

  const handleMouseUp = useCallback(() => {
    if (!isResizing.current) return;

    isResizing.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="relative" ref={containerRef}>
      <EditorContent
        editor={editor}
        style={{
          minHeight,
          maxHeight,
          ...(manualHeight !== null && { height: manualHeight }),
        }}
        className={`p-4 text-[16px] bg-secondary-1 outline-none rounded-[10px] border border-neutral-17 w-full overflow-y-auto ${className}`}
      />
      <div
        onMouseDown={handleMouseDown}
        className="absolute bottom-0 right-0 cursor-ns-resize p-px group"
        aria-label="Resize editor"
        role="slider"
        tabIndex={0}
      >
        <Image src="/create-flow/resize.svg" alt="resize icon" width={24} height={24} />
      </div>
    </div>
  );
};

export default ResizableEditor;
