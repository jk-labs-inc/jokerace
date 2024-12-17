import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDeployContestStore } from "@hooks/useDeployContest/store";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";

interface ImageUploadProps {
  step?: number;
  icon?: React.ReactNode;
  isSuccess?: boolean;
  isError?: boolean;
  initialImageUrl?: string;
  onFileSelect?: (file: File | null) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({ onFileSelect, step, isSuccess, initialImageUrl }) => {
  const { errors } = useDeployContestStore(state => state);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImageUrl || null);

  useEffect(() => {
    setSelectedImage(initialImageUrl || null);
  }, [initialImageUrl]);

  const currentStepError = errors.find(error => error.step === step);
  const uploadError = currentStepError?.message === "upload";
  const fileUploadIconWidth = 58;
  const fileUploadIconHeight = 34;

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      onFileSelect?.(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      const file = files[0];
      onFileSelect?.(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    onFileSelect?.(null);
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
      onClick={selectedImage ? undefined : handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      className={`relative flex shadow-file-upload m-auto md:m-0 flex-col w-full h-40 md:w-[376px] md:h-36 justify-center items-center border border-transparent hover:border-positive-11 gap-4 py-6 px-10 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out ${borderStyles}`}
      style={{
        backgroundImage: selectedImage ? `url(${selectedImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileInput} accept="image/*" />
      {!selectedImage && !uploadError && Icon}
      {selectedImage && (
        <button
          onClick={handleRemoveImage}
          className="absolute top-2 right-2 bg-true-black rounded-full p-1 shadow-md hover:bg-neutral-3 transition-colors duration-200"
        >
          <XMarkIcon className="w-6 h-6 text-neutral-11" />
        </button>
      )}
      <div className={`text-[16px] flex flex-col ${isSuccess ? "gap-3" : "gap-0"}`}>
        {!selectedImage && (
          <>
            <p className="text-neutral-11 text-[16px] font-bold">drag & drop image/gif</p>
            <span className="text-neutral-11 text-[16px] font-normal self-center">
              or <span className="text-[16px] text-positive-11">browse</span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
