import { DocumentAddIcon } from "@heroicons/react/24/outline";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import Image from "next/image";
import React, { FC, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

type FileTypes = "csv" | "docx";

interface FileUploadProps {
  step?: number;
  icon?: React.ReactNode;
  type?: FileTypes;
  isSuccess?: boolean;
  isError?: boolean;
  onFileSelect?: (file: File) => void;
}

const FileUpload: FC<FileUploadProps> = ({ onFileSelect, type = "csv", step, isSuccess }) => {
  const { errors } = useDeployContestStore(state => state);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const currentStepError = errors.find(error => error.step === step);
  const entriesError = currentStepError?.message === "entries";
  const fileUploadIconWidth = isMobile ? 58 : 76;
  const fileUploadIconHeight = isMobile ? 34 : 45;

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
    setIsDragOver(true);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect?.(files[0]);
    }
    setIsDragOver(false);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const Icon = useMemo<React.ReactNode>(() => {
    if (type === "csv") {
      return (
        <Image src="/create-flow/csv_upload.png" width={fileUploadIconWidth} height={fileUploadIconHeight} alt="csv" />
      );
    } else if (type === "docx") {
      return <DocumentAddIcon className="w-[50px]" />;
    } else {
      return null;
    }
  }, [fileUploadIconHeight, fileUploadIconWidth, type]);

  // Define the mime types for each file type
  const mimeTypes: Record<FileTypes, string> = {
    csv: "text/csv",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const borderStyles = entriesError
    ? "border-negative-11 hover:border-negative-10"
    : isSuccess
      ? "border-positive-11 hover:border-positive-9"
      : isDragOver
        ? "border-neutral-10"
        : "border-neutral-10 hover:border-neutral-11";

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      className={`flex shadow-file-upload m-auto md:m-0 flex-col w-full h-40 md:w-[520px] md:h-60 justify-center items-center gap-4 ${
        type === "csv" ? "py-7" : "py-3"
      } px-10 border-2 border-dotted rounded-[25px] cursor-pointer transition-all duration-500 ease-in-out ${borderStyles}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileInput}
        accept={mimeTypes[type]}
      />
      {!entriesError && !isSuccess && Icon}

      <div className={`text-[16px] flex flex-col ${isSuccess ? "gap-3" : "gap-0"}`}>
        {isSuccess ? (
          <>
            <div className="flex gap-4 items-center text-positive-11">
              <Image src="/create-flow/success.png" height={32} width={32} alt="success" />
              <span className="uppercase text-[24px] font-bold ">success!</span>
            </div>
            <p className="text-center text-positive-11">+ add more addresses</p>
          </>
        ) : (
          <>
            <p className="font-bold">drag & drop {type}</p>
            <span className="font-normal self-center">
              or <span className="text-positive-11">browse</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
