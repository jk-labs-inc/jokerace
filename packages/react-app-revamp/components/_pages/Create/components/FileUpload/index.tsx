import Image from "next/image";
import React, { FC, useRef } from "react";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
}

const FileUpload: FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect?.(files[0]);
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

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="inline-flex items-center gap-6 py-3 px-10 border-2 border-dotted rounded-[10px] cursor-pointer"
    >
      <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileInput} />
      <Image src="/create-flow/upload.png" alt="upload" width={44} height={44} className="mt-[5px]" />
      <p className="text-[16px] font-bold">
        drag & drop <br />{" "}
        <span className="font-normal">
          or <span className="text-positive-11">browse</span>
        </span>
      </p>
    </div>
  );
};

export default FileUpload;
