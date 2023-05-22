import { CloudIcon, CloudUploadIcon, DocumentAddIcon } from "@heroicons/react/outline";
import React, { FC, useRef } from "react";

type FileTypes = "csv" | "docx";

interface FileUploadProps {
  icon?: React.ReactNode;
  type?: FileTypes;
  isSuccess?: boolean;
  isError?: boolean;
  onFileSelect?: (file: File) => void;
}

const FileUpload: FC<FileUploadProps> = ({ onFileSelect, icon, type = "csv" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect?.(files[0]);
    }
    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect?.(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Define the mime types for each file type
  const mimeTypes: Record<FileTypes, string> = {
    csv: "text/csv",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="inline-flex items-center gap-6 py-3 px-10 border-2 border-dotted rounded-[10px] cursor-pointer animate-border-dance"
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileInput}
        accept={mimeTypes[type]}
      />
      <CloudIcon className="w-[50px]" />
      <div className="text-[16px] flex flex-col">
        <p className="font-bold">drag & drop {type}</p>
        <span className="font-normal self-center">
          or <span className="text-positive-11">browse</span>
        </span>
      </div>
    </div>
  );
};

export default FileUpload;
