import { useDeployContestStore } from "@hooks/useDeployContest/store";
import React, { FC, useMemo, useRef, useState } from "react";
import { ACCEPTED_FILE_TYPES } from "./utils";

interface ImageUploadProps {
  step?: number;
  icon?: React.ReactNode;
  isSuccess?: boolean;
  isError?: boolean;
  onFileSelect?: (file: File) => void;
}

//TODO: come back here and check if we can improve it ( add image preview, way to delete, to change etc.)
const ImageUpload: FC<ImageUploadProps> = ({ onFileSelect, step, isSuccess }) => {
  const { errors } = useDeployContestStore(state => state);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const currentStepError = errors.find(error => error.step === step);
  const uploadError = currentStepError?.message === "upload";
  const fileUploadIconWidth = 58;
  const fileUploadIconHeight = 34;

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect?.(files[0]);
    }
    // reset the file input value
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
    return (
      <img src="/create-flow/csv_upload.png" width={fileUploadIconWidth} height={fileUploadIconHeight} alt="upload" />
    );
  }, [fileUploadIconHeight, fileUploadIconWidth]);

  const borderStyles = uploadError
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
      className={`flex shadow-file-upload m-auto md:m-0 flex-col w-full h-40 md:w-[344px] md:h-32 justify-center items-center border border-transparent hover:border-positive-11  gap-4 py-6 px-10 rounded-[32px] cursor-pointer transition-all duration-300 ease-in-out ${borderStyles}`}
    >
      <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileInput} accept="image/*" />
      {!uploadError && !isSuccess && Icon}

      <div className={`text-[16px] flex flex-col ${isSuccess ? "gap-3" : "gap-0"}`}>
        {isSuccess ? (
          <>
            <div className="flex gap-4 items-center text-positive-11">
              <img src="/create-flow/success.png" height={32} width={32} alt="success" />
              <span className="uppercase text-[24px] font-bold ">success!</span>
            </div>
            <p className="text-center text-positive-11">image uploaded successfully</p>
          </>
        ) : (
          <>
            <p className="text-neutral-10 text-[16px] font-bold">drag & drop image/gif</p>
            <span className="text-neutral-10 text-[16px] font-normal self-center">
              or <span className="text-[16px] text-positive-11">browse</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
